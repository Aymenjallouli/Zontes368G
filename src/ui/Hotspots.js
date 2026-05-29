import gsap from 'gsap'
import { HOTSPOTS_BY_FRAME } from './UIManager.js'

export class Hotspots {
  constructor(viewer360) {
    this._v      = viewer360
    this._layer  = document.getElementById('hs-layer')
    this._active = []
    this._lastFrame = -1

    // Called by Viewer360 on every frame change
    viewer360.onFrameChange = (frameIdx) => {
      this._onFrame(frameIdx)
    }

    window.addEventListener('resize', () => this._reposition())
  }

  _onFrame(frameIdx) {
    if (frameIdx === this._lastFrame) return
    this._lastFrame = frameIdx

    const data = HOTSPOTS_BY_FRAME[frameIdx]

    // Fade out existing
    if (this._active.length) {
      gsap.to(this._active, {
        opacity: 0, scale: .5, duration: .18, ease: 'power2.in',
        onComplete: () => {
          this._active.forEach(el => el.remove())
          this._active = []
          if (data) this._inject(data)
        },
      })
    } else {
      if (data) this._inject(data)
    }
  }

  _inject(data) {
    data.forEach((h, i) => {
      const el = document.createElement('div')
      el.className = 'hs'
      el.innerHTML = `
        <div class="hs-ring"></div>
        <div class="hs-tip">
          <div class="hs-t">${h.t}</div>
          <div class="hs-d">${h.d}</div>
        </div>
      `
      this._layer.appendChild(el)
      this._active.push(el)
      this._place(el, h.x, h.y)

      gsap.fromTo(el,
        { opacity: 0, scale: .4 },
        { opacity: 1, scale: 1, duration: .35, delay: i * .08, ease: 'back.out(2)' }
      )
    })
  }

  _place(el, xPct, yPct) {
    // Find the currently visible bike image by opacity
    const imgs  = Array.from(document.querySelectorAll('#frame-wrap .bike-img'))
    const imgEl = imgs.find(img => parseFloat(img.style.opacity) >= 0.9) || imgs[0]
    if (!imgEl) return

    // Use the actual rendered bounds — works regardless of sizing strategy
    const rect = imgEl.getBoundingClientRect()
    el.style.left = `${rect.left + (xPct / 100) * rect.width}px`
    el.style.top  = `${rect.top  + (yPct / 100) * rect.height}px`
  }

  _reposition() {
    const data = HOTSPOTS_BY_FRAME[this._lastFrame]
    if (!data) return
    this._active.forEach((el, i) => {
      const h = data[i]
      if (h) this._place(el, h.x, h.y)
    })
  }
}
