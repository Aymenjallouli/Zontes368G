/**
 * BackgroundRemover — studio white-background remover
 *
 * Algorithm
 * ─────────
 * 1. Flood-fill BFS from all 4 image borders.
 *    Any pixel whose Manhattan RGB distance from the sampled corner colour
 *    is ≤ threshold is treated as background and removed.
 *
 * 2. Bottom-shadow sweep (second pass).
 *    After the main BFS, scan upward from the bottom row and remove any
 *    remaining near-white pixel that is contiguous with already-removed
 *    background — catches soft floor shadows the BFS missed.
 *
 * 3. Soft-edge anti-aliasing: edge pixels get partial alpha.
 *
 * Thresholds (Manhattan RGB distance):
 *   blue  → 320  dark blue bike vs white bg — very safe margin
 *   black → 320  dark bike vs white bg
 *   blanc →  50  white bike vs white bg — conservative; rely on CSS fade too
 */

const THRESHOLD = { blue: 320, black: 320, blanc: 50 }

export class BackgroundRemover {
  constructor() {
    this._cache = new Map()
    this._queue = []
    this._busy  = false
    this._cbs   = new Map()
  }

  schedule(imgEl, colorKey, onDone) {
    const src = imgEl.src
    if (this._cache.has(src)) { onDone(this._cache.get(src)); return }

    if (!this._cbs.has(src)) this._cbs.set(src, [])
    this._cbs.get(src).push(onDone)

    if (this._queue.find(t => t.src === src)) return
    this._queue.push({ imgEl, src, colorKey })
    if (!this._busy) this._next()
  }

  _next() {
    if (!this._queue.length) { this._busy = false; return }
    this._busy = true
    const task = this._queue.shift()
    requestAnimationFrame(() => this._run(task))
  }

  _run({ imgEl, src, colorKey }) {
    if (!imgEl.naturalWidth) {
      imgEl.addEventListener('load', () => this._run({ imgEl, src, colorKey }), { once: true })
      return
    }
    try {
      const W = imgEl.naturalWidth, H = imgEl.naturalHeight
      const canvas = document.createElement('canvas')
      canvas.width = W; canvas.height = H
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(imgEl, 0, 0)

      const id = ctx.getImageData(0, 0, W, H)
      _process(id, THRESHOLD[colorKey] ?? 200)
      ctx.putImageData(id, 0, 0)

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob)
        this._cache.set(src, url)
        this._cbs.get(src)?.forEach(cb => cb(url))
        this._cbs.delete(src)
        this._next()
      }, 'image/webp', 0.92)
    } catch (e) {
      console.warn('[BgRemover]', e)
      this._cbs.get(src)?.forEach(cb => cb(null))
      this._cbs.delete(src)
      this._next()
    }
  }
}

/* ── Core pixel processing (pure function) ──────────────────────────── */
function _process(imageData, threshold) {
  const { data, width: W, height: H } = imageData

  /* ① Sample background colour from 4 corners ─────────────────────── */
  let bgR = 0, bgG = 0, bgB = 0
  [[0,0],[W-1,0],[0,H-1],[W-1,H-1]].forEach(([x,y]) => {
    const p = (y*W+x)*4; bgR+=data[p]; bgG+=data[p+1]; bgB+=data[p+2]
  })
  bgR=bgR/4|0; bgG=bgG/4|0; bgB=bgB/4|0

  /* ② Flood-fill BFS from all border pixels ──────────────────────── */
  const isBg   = new Uint8Array(W * H)   // 1 = background
  const visited = new Uint8Array(W * H)
  const Q      = new Int32Array(W * H * 2)
  let qH = 0, qT = 0

  const push = (x, y) => {
    const i = y*W+x; if (visited[i]) return; visited[i]=1
    Q[qT++]=x; Q[qT++]=y
  }

  for (let x=0;x<W;x++) { push(x,0); push(x,H-1) }
  for (let y=1;y<H-1;y++) { push(0,y); push(W-1,y) }

  while (qH < qT) {
    const x=Q[qH++], y=Q[qH++]
    const pi=(y*W+x)*4
    const dist = Math.abs(data[pi]-bgR)+Math.abs(data[pi+1]-bgG)+Math.abs(data[pi+2]-bgB)
    if (dist <= threshold) {
      isBg[y*W+x]=1
      if (x>0)   push(x-1,y)
      if (x<W-1) push(x+1,y)
      if (y>0)   push(x,y-1)
      if (y<H-1) push(x,y+1)
    }
  }

  /* ③ Bottom-shadow sweep — scan upward from bottom, remove residual
     near-white pixels that are adjacent to already-removed background.
     This catches soft floor shadows the BFS missed because they are
     slightly darker than the strict threshold.                          */
  const shadowThreshold = Math.round(threshold * 0.55)  // more permissive
  for (let y = H-1; y >= Math.floor(H * 0.60); y--) {
    for (let x = 0; x < W; x++) {
      if (isBg[y*W+x]) continue   // already background
      const pi = (y*W+x)*4
      const dist = Math.abs(data[pi]-bgR)+Math.abs(data[pi+1]-bgG)+Math.abs(data[pi+2]-bgB)
      // Remove if it's near-white AND adjacent to confirmed background
      if (dist <= shadowThreshold) {
        const adjBg =
          (y+1<H  && isBg[(y+1)*W+x]) ||
          (x>0    && isBg[y*W+x-1])   ||
          (x<W-1  && isBg[y*W+x+1])
        if (adjBg) isBg[y*W+x] = 1
      }
    }
  }

  /* ④ Apply alpha + soft-edge anti-aliasing ─────────────────────── */
  for (let y=0; y<H; y++) {
    for (let x=0; x<W; x++) {
      const i=y*W+x, pi=i*4
      if (isBg[i]) { data[pi+3]=0; continue }

      if (x>0 && x<W-1 && y>0 && y<H-1) {
        const nbg =
          (isBg[(y-1)*W+x-1]?1:0)+(isBg[(y-1)*W+x]?1:0)+(isBg[(y-1)*W+x+1]?1:0)+
          (isBg[y*W+x-1]    ?1:0)+                        (isBg[y*W+x+1]    ?1:0)+
          (isBg[(y+1)*W+x-1]?1:0)+(isBg[(y+1)*W+x]?1:0)+(isBg[(y+1)*W+x+1]?1:0)
        if (nbg>0) data[pi+3] = Math.round(255*(1-(nbg/8)*0.88))
      }
    }
  }
}
