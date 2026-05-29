import gsap from 'gsap'

export class IntroScreen {
  play() {
    return new Promise(resolve => {
      /* Try engine sound — works on desktop, silently fails on mobile without prior interaction */
      const audio = new Audio('/sounds/engine.mp3')
      audio.volume = 0.85
      setTimeout(() => audio.play().catch(() => {}), 850)
      setTimeout(() => {
        let i = 0
        const fade = setInterval(() => {
          i++
          audio.volume = Math.max(0, 0.85 * (1 - i / 25))
          if (i >= 25) { clearInterval(fade); audio.pause() }
        }, 50)
      }, 2900)

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
    })
  }
}
