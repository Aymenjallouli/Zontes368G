import gsap from 'gsap'

const FRAMES = [
  '/withoutbackground/frontside-removebg-preview.png',
  '/withoutbackground/rightfrontside-removebg-preview.png',
  '/withoutbackground/fullrightside-removebg-preview.png',
  '/withoutbackground/rightbackside-removebg-preview.png',
  '/withoutbackground/backside-removebg-preview.png',
  '/withoutbackground/leftbackside-removebg-preview.png',
  '/withoutbackground/fullleftside-removebg-preview.png',
  '/withoutbackground/leftfrontside-removebg-preview.png',
]

const N   = FRAMES.length
const DEG = 360 / N

const LABELS = [
  'FACE AVANT', 'AV. DROITE', 'PROFIL DROIT', 'ARR. DROITE',
  'FACE ARRIÈRE', 'ARR. GAUCHE', 'PROFIL GAUCHE', 'AV. GAUCHE',
]

export class Viewer360 {
  constructor() {
    this.angle = 0

    /* rotation */
    this._vel          = 0
    this._prevX        = 0
    this._prevT        = 0
    this._isDrag       = false
    this._inertiaId    = null
    this._visibleFrame = 0
    this._flashTimer   = null
    this._hintHidden   = false

    /* zoom */
    this._scale    = 1.0
    this._minScale = 0.6
    this._maxScale = 3.0
    this._pinchDist = 0

    /** callbacks */
    this.onFrameChange = null
    this.onZoomChange  = null

    this._buildImgs()
    this._buildReflect()
    this._bindInteraction()
    this._updateDisplay()
  }

  /* ── Images ────────────────────────────────────────────────── */
  _buildImgs() {
    const wrap = document.getElementById('frame-wrap')
    wrap.innerHTML = ''
    this._imgs = FRAMES.map((src, i) => {
      const img = document.createElement('img')
      img.className        = 'bike-img'
      img.draggable        = false
      img.alt              = LABELS[i]
      img.style.opacity    = '0'
      img.style.transition = 'none'
      img.src              = src
      wrap.appendChild(img)
      return img
    })
    this._imgs[0].style.opacity = '1'
  }

  _buildReflect() {
    this._imgRef = document.getElementById('img-reflect')
    if (this._imgRef) this._imgRef.src = FRAMES[0]
  }

  /* ── Display ───────────────────────────────────────────────── */
  _updateDisplay() {
    const normal = ((this.angle % 360) + 360) % 360
    const frame  = Math.round(normal / DEG) % N

    if (frame !== this._visibleFrame) {
      this._imgs[this._visibleFrame].style.opacity = '0'
      const img = this._imgs[frame]
      img.style.transition = 'opacity 0.05s ease'
      img.style.opacity    = '1'
      this._visibleFrame   = frame
      clearTimeout(this._flashTimer)
      this._flashTimer = setTimeout(() => { img.style.transition = 'none' }, 60)
      if (this._imgRef) this._imgRef.src = FRAMES[frame]
      if (this.onFrameChange) this.onFrameChange(frame)
      const lbl = document.getElementById('angle-label')
      if (lbl) lbl.textContent = LABELS[frame]
    }

    const arc = document.getElementById('arc-fill')
    if (arc) {
      const C = 2 * Math.PI * 28
      arc.style.strokeDashoffset = String(C * (1 - normal / 360))
    }
  }

  /* ── Zoom ──────────────────────────────────────────────────── */
  _applyZoom(animated = false) {
    const stage = document.getElementById('stage360')
    if (animated) {
      stage.style.transition = 'transform 0.35s cubic-bezier(.25,.46,.45,.94)'
      requestAnimationFrame(() => {
        stage.style.transform = this._scale === 1 ? '' : `scale(${this._scale.toFixed(4)})`
        setTimeout(() => { stage.style.transition = '' }, 380)
      })
    } else {
      stage.style.transform = this._scale === 1 ? '' : `scale(${this._scale.toFixed(4)})`
    }
    if (this.onZoomChange) this.onZoomChange(this._scale)
  }

  zoomBy(delta, animated = false) {
    this._scale = Math.max(this._minScale, Math.min(this._maxScale, this._scale + delta))
    this._applyZoom(animated)
  }

  resetZoom() {
    this._scale = 1.0
    this._applyZoom(true)
  }

  _getTouchDist(touches) {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  /* ── All input bindings ────────────────────────────────────── */
  _bindInteraction() {
    const zone = document.getElementById('drag-zone')

    /* ─ drag helpers ─ */
    const onStart = (x) => {
      this._stopInertia()
      this._isDrag = true
      this._prevX  = x
      this._prevT  = performance.now()
      this._vel    = 0
      this._hideHint()
    }

    const onMove = (x) => {
      if (!this._isDrag) return
      const now = performance.now()
      const dt  = Math.max(now - this._prevT, 1)
      const dx  = x - this._prevX
      this._vel   = dx / dt
      this.angle  = (this.angle - (dx / (window.innerWidth * 0.65)) * 360 + 36000) % 360
      this._prevX = x
      this._prevT = now
      this._updateDisplay()
    }

    const onEnd = () => {
      if (!this._isDrag) return
      this._isDrag = false
      this._launchInertia()
    }

    /* ─ mouse ─ */
    zone.addEventListener('mousedown', e => onStart(e.clientX))
    window.addEventListener('mousemove', e => onMove(e.clientX))
    window.addEventListener('mouseup', onEnd)

    /* ─ double-click → reset zoom ─ */
    zone.addEventListener('dblclick', () => this.resetZoom())

    /* ─ wheel: plain = rotate · Ctrl/pinch = zoom ─ */
    zone.addEventListener('wheel', e => {
      if (e.ctrlKey) {
        e.preventDefault()
        /* trackpad pinch sends ctrlKey + small deltaY */
        const delta = e.deltaY < 0 ? 0.08 : -0.08
        this.zoomBy(delta)
      } else {
        this._stopInertia()
        this.angle = (this.angle + e.deltaY * 0.04 + 36000) % 360
        this._vel  = e.deltaY * 0.0015
        this._updateDisplay()
        this._launchInertia()
      }
    }, { passive: false })

    /* ─ touch ─ */
    zone.addEventListener('touchstart', e => {
      if (e.touches.length === 2) {
        this._pinchDist = this._getTouchDist(e.touches)
        this._stopInertia()
        this._isDrag = false
        return
      }
      this._pinchDist = 0
      onStart(e.touches[0].clientX)
    }, { passive: true })

    zone.addEventListener('touchmove', e => {
      e.preventDefault()
      if (e.touches.length === 2) {
        const d = this._getTouchDist(e.touches)
        if (this._pinchDist > 0) {
          const ratio = d / this._pinchDist
          this._scale = Math.max(this._minScale, Math.min(this._maxScale, this._scale * ratio))
          this._applyZoom()
        }
        this._pinchDist = d
        return
      }
      onMove(e.touches[0].clientX)
    }, { passive: false })

    zone.addEventListener('touchend', e => {
      if (e.touches.length === 0) {
        this._pinchDist = 0
        onEnd()
      }
    }, { passive: true })

    /* ─ keyboard ─ */
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  this._stepBy(-1)
      if (e.key === 'ArrowRight') this._stepBy(1)
      if (e.key === '+' || e.key === '=') this.zoomBy(0.15, true)
      if (e.key === '-')                   this.zoomBy(-0.15, true)
      if (e.key === '0')                   this.resetZoom()
    })

    /* ─ buttons ─ */
    document.getElementById('btn-prev')?.addEventListener('click', () => this._stepBy(-1))
    document.getElementById('btn-next')?.addEventListener('click', () => this._stepBy(1))
    document.getElementById('btn-zoom-in')?.addEventListener('click',  () => this.zoomBy(0.2, true))
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => this.zoomBy(-0.2, true))
    document.getElementById('btn-zoom-reset')?.addEventListener('click', () => this.resetZoom())
  }

  _stepBy(dir) {
    this._stopInertia()
    gsap.to(this, {
      angle: this.angle + dir * DEG,
      duration: 0.5,
      ease: 'power3.out',
      onUpdate: () => this._updateDisplay(),
    })
  }

  /* ── Inertia ───────────────────────────────────────────────── */
  _launchInertia() {
    if (Math.abs(this._vel) < 0.02) return
    let v = -(this._vel / (window.innerWidth * 0.65)) * 360 * (1000 / 60)
    const tick = () => {
      v *= 0.87
      if (Math.abs(v) < 0.04) { this._vel = 0; return }
      this.angle      = (this.angle + v + 36000) % 360
      this._vel       = -(v / (1000 / 60)) * (window.innerWidth * 0.65) / 360
      this._updateDisplay()
      this._inertiaId = requestAnimationFrame(tick)
    }
    this._inertiaId = requestAnimationFrame(tick)
  }

  _stopInertia() {
    if (this._inertiaId) cancelAnimationFrame(this._inertiaId)
    this._inertiaId = null
    this._vel = 0
  }

  _hideHint() {
    if (this._hintHidden) return
    this._hintHidden = true
    gsap.to('#drag-hint', { opacity: 0, y: 6, duration: 0.4 })
  }

  goToFrame(i) {
    gsap.to(this, {
      angle: i * DEG,
      duration: 0.6,
      ease: 'power3.inOut',
      onUpdate: () => this._updateDisplay(),
    })
  }
}
