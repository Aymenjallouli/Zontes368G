import gsap from 'gsap'

export class IntroScreen {
  play() {
    return new Promise(resolve => {
      this._animate(resolve)
      this._setupSound()
    })
  }

  _animate(resolve) {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to('#intro', {
          opacity: 0, duration: .55, ease: 'power2.inOut',
          onComplete: () => {
            document.getElementById('intro').style.display = 'none'
            document.getElementById('scene').classList.add('visible')
            resolve()
          },
        })
      },
    })

    tl.to('#intro-progress', { width: '100%', duration: 3.2, ease: 'none' }, 0)

    tl.fromTo('#intro-logo',
      { opacity: 0, y: 10, filter: 'blur(6px)' },
      { opacity: 1, y: 0,  filter: 'blur(0px)', duration: .75, ease: 'power3.out' },
      0.15
    )

    tl.fromTo('#intro-num',
      { opacity: 0, letterSpacing: '.1em', filter: 'blur(14px)', scale: 1.05 },
      { opacity: 1, letterSpacing: '.04em', filter: 'blur(0px)',  scale: 1,
        duration: .65, ease: 'power3.out' },
      0.85
    )

    tl.to('#intro-num', { skewX: 12,  color: '#c49a2a', duration: .04 }, 1.60)
    tl.to('#intro-num', { skewX: -7,  color: '#fff',    duration: .04 }, 1.65)
    tl.to('#intro-num', { skewX:  4,  color: '#c49a2a', duration: .04 }, 1.70)
    tl.to('#intro-num', { skewX:  0,  color: '#fff',    duration: .04 }, 1.75)

    tl.fromTo('#intro-sub',
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: .45, ease: 'power2.out' },
      1.95
    )
  }

  _setupSound() {
    const hint  = document.getElementById('intro-sound-hint')
    const audio = new Audio('/sounds/engine.mp3')
    audio.volume = 0.85

    /* Show hint after the 368G appears */
    gsap.to(hint, {
      opacity: 1, duration: 0.5, delay: 1.1,
      onComplete: () => { hint.style.pointerEvents = 'all' },
    })
    gsap.to(hint, {
      opacity: 0.35, duration: 1.1, repeat: -1, yoyo: true,
      ease: 'sine.inOut', delay: 1.6,
    })

    const onTap = () => {
      gsap.killTweensOf(hint)
      gsap.to(hint, { opacity: 0, duration: 0.3 })
      hint.style.pointerEvents = 'none'

      audio.play().catch(() => {})

      /* Fade out before intro ends */
      setTimeout(() => {
        let i = 0
        const t = setInterval(() => {
          i++
          audio.volume = Math.max(0, 0.85 * (1 - i / 25))
          if (i >= 25) { clearInterval(t); audio.pause() }
        }, 50)
      }, 2500)
    }

    hint.addEventListener('click',      onTap, { once: true })
    hint.addEventListener('touchstart', onTap, { once: true, passive: true })
  }
}
