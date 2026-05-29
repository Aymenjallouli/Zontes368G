import gsap from 'gsap'

/* ── Données photos ────────────────────────────────────────────────────────
   Fichiers à placer dans  /public/images/
   ─────────────────────────────────────────────────────────────────────── */
export const PHOTOS = [
  {
    id: 'side',          src: '/images/01-side.jpg',
    label: 'Profil',     cat: 'STYLE',
    hs: [
      { x:37, y:40, t:'CARÉNAGES',        d:'Design géométrique · Accents dorés signature · ABS haute résistance' },
      { x:55, y:36, t:'COFFRE 30L',       d:'Casque intégral · Éclairage LED · Port USB 5V/2A' },
      { x:75, y:50, t:'SUSPENSION ARR.',  d:'Double amortisseur · Précharge réglable · Débattement 90 mm' },
    ],
  },
  {
    id: 'front',         src: '/images/02-front.jpg',
    label: 'Face avant', cat: 'STYLE',
    hs: [
      { x:50, y:62, t:'FULL LED',         d:'Double optique 3 000 lm · DRL signature · Feux diurnes intégrés' },
      { x:22, y:56, t:'CLIGNOTANTS LED',  d:'Intégrés carénage · Homologués E9' },
      { x:50, y:28, t:'BULLE RÉGLABLE',   d:'3 positions ±30 mm · Polycarbonate anti-UV' },
      { x:50, y:86, t:'BARRE PROTECTION', d:'Arceau inox Ø22 mm · Compatible porte-valises' },
    ],
  },
  {
    id: 'rear',          src: '/images/03-rear.jpg',
    label: '3/4 arrière', cat: 'STYLE',
    hs: [
      { x:50, y:30, t:'FEU ARRIÈRE LED',  d:'Stop intégré · Full LED · Homologué' },
      { x:60, y:68, t:'ROUE ARRIÈRE',     d:'Jante aluminium à rayons · 150/70-13 · ABS série' },
    ],
  },
  {
    id: 'cockpit',       src: '/images/04-cockpit.jpg',
    label: 'Cockpit',    cat: 'TECHNIQUE',
    hs: [
      { x:50, y:52, t:'ÉCRAN TFT 7"',     d:'Couleur · Bluetooth · Modes conduite · GPS en option' },
      { x:25, y:58, t:'PROTÈGE-MAINS',    d:'De série · ABS · LED intégrée' },
      { x:50, y:80, t:'BADGE HEXA',       d:'Aluminium usiné · Signature design 368G' },
    ],
  },
  {
    id: 'wheel',         src: '/images/05-wheel-front.jpg',
    label: 'Roue avant', cat: 'TECHNIQUE',
    hs: [
      { x:58, y:50, t:'DISQUE 285mm',     d:'Étrier J.JUAN 2P · ABS Bosch série · Plaquettes HF' },
      { x:34, y:26, t:'FOURCHE USD Ø41',  d:'Débattement 110 mm · Réglage précharge' },
      { x:82, y:58, t:'PNEU TRAIL',       d:'120/70-15 · Mixte route/piste · Indice H' },
    ],
  },
  {
    id: 'handguard',     src: '/images/06-handguard.jpg',
    label: 'Protège-mains', cat: 'CONFORT',
    hs: [
      { x:44, y:46, t:'PROTÈGE-MAINS',    d:'Série · ABS thermoformé · Intempéries · LED embarquée' },
      { x:73, y:44, t:'POIGNÉE CHAUFFANTE', d:'Option · 3 niveaux · Commande au pouce' },
    ],
  },
  {
    id: 'storage',       src: '/images/07-storage.jpg',
    label: 'Coffre',     cat: 'CONFORT',
    hs: [
      { x:54, y:44, t:'30 LITRES',        d:'Casque taille XL · Joint silicone · Fermeture électrique option' },
      { x:27, y:33, t:'PORT USB',         d:'5V/2A · Câble inclus · Charge rapide option' },
    ],
  },
  {
    id: 'console',       src: '/images/08-console.jpg',
    label: 'Console AV', cat: 'CONFORT',
    hs: [
      { x:50, y:48, t:'VIDE-POCHES',      d:'Verrouillable · NFC · Prise 12V + USB · Imperméable' },
      { x:63, y:82, t:'RÉSERVOIR 11L',    d:'Bouchon sécurisé · Jauge LCD ½L de précision' },
    ],
  },
  {
    id: 'seat',          src: '/images/09-seat.jpg',
    label: 'Selle',      cat: 'CONFORT',
    hs: [
      { x:48, y:30, t:'SELLE BIPLACE',    d:'Mousse bi-densité · H. 790 mm · Insert doré ADV · Chauffante option' },
      { x:28, y:68, t:'GRAPHISME 368G',   d:'Accents dorés sérigraphiés · UV-résistant 10 ans' },
    ],
  },
  {
    id: 'radiator',      src: '/images/10-radiator.jpg',
    label: 'Moteur',     cat: 'TECHNIQUE',
    hs: [
      { x:60, y:46, t:'RADIATEUR',        d:'Liquide · Grille alu hexagonale · Ventilateur thermo-commandé' },
      { x:40, y:70, t:'368cc DOHC',       d:'Monocylindre 4T · Injection Delphi · Euro5 · 30 ch' },
    ],
  },
]

/* ── Catégories pour les tabs ──────────────────────────────────────────── */
export const CATEGORIES = ['STYLE', 'TECHNIQUE', 'CONFORT']

/* ════════════════════════════════════════════════════════════════════════ */
export class PhotoViewer {
  constructor() {
    this.photos  = PHOTOS
    this.current = 0
    this.busy    = false

    /** callback fired on every photo change */
    this.onChange = null

    this._els = []
    this._dots = []

    this._buildSlides()
    this._buildDots()
    this._buildTabs()
    this._bindNav()
    this._show(0, false)
  }

  /* ── Build DOM ─────────────────────────────────────────────────────── */
  _buildSlides() {
    const stage = document.getElementById('stage')
    this.photos.forEach((p, i) => {
      const slide = document.createElement('div')
      slide.className = 'slide'

      const img = document.createElement('img')
      img.src = p.src
      img.alt = p.label
      img.loading = i === 0 ? 'eager' : 'lazy'
      img.draggable = false

      // Clean placeholder — no emojis, just typography
      const ph = document.createElement('div')
      ph.className = 'slide-ph'
      ph.innerHTML = `
        <p class="slide-ph-name">${p.label.toUpperCase()}</p>
        <p class="slide-ph-hint">
          Enregistrez <code>${p.src.replace('/images/','')}</code><br>dans <code>public/images/</code>
        </p>
      `
      ph.style.display = 'none'

      img.addEventListener('error', () => {
        img.style.display = 'none'
        ph.style.display  = 'flex'
      })

      slide.appendChild(img)
      slide.appendChild(ph)
      stage.appendChild(slide)
      this._els.push({ el: slide, img, ph })
    })
  }

  _buildDots() {
    const wrap = document.getElementById('dots-wrap')
    this.photos.forEach((_, i) => {
      const d = document.createElement('button')
      d.className = 'dot'
      d.ariaLabel = `Vue ${i + 1}`
      d.addEventListener('click', () => this.goTo(i))
      wrap.appendChild(d)
      this._dots.push(d)
    })
  }

  _buildTabs() {
    const nav = document.getElementById('view-tabs')
    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button')
      btn.className = 'view-tab'
      btn.textContent = cat
      btn.addEventListener('click', () => {
        const idx = this.photos.findIndex(p => p.cat === cat)
        if (idx !== -1) this.goTo(idx)
      })
      nav.appendChild(btn)
    })
    this._tabs = Array.from(nav.querySelectorAll('.view-tab'))
  }

  /* ── Navigation ────────────────────────────────────────────────────── */
  _bindNav() {
    document.getElementById('btn-prev').addEventListener('click', () => this.prev())
    document.getElementById('btn-next').addEventListener('click', () => this.next())

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  this.prev()
      if (e.key === 'ArrowRight') this.next()
    })

    // Touch + mouse drag
    const stage = document.getElementById('stage')
    let sx = 0, dragging = false

    stage.addEventListener('touchstart',  e => { sx = e.touches[0].clientX },           { passive: true })
    stage.addEventListener('touchend',    e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 40) d > 0 ? this.prev() : this.next() }, { passive: true })
    stage.addEventListener('mousedown',   e => { sx = e.clientX; dragging = true })
    stage.addEventListener('mouseup',     e => { if (!dragging) return; dragging = false; const d = e.clientX - sx; if (Math.abs(d) > 40) d > 0 ? this.prev() : this.next() })
    stage.addEventListener('mouseleave',  () => { dragging = false })
  }

  next() { this.goTo((this.current + 1) % this.photos.length) }
  prev() { this.goTo((this.current - 1 + this.photos.length) % this.photos.length) }

  goTo(i) {
    if (i === this.current || this.busy) return
    this._show(i, true, i > this.current ? 1 : -1)
  }

  /* ── Transition ────────────────────────────────────────────────────── */
  _show(idx, animate, dir = 1) {
    const from = this._els[this.current]
    const to   = this._els[idx]

    if (animate) {
      this.busy = true
      const tl = gsap.timeline({ onComplete: () => { this.busy = false } })
      tl.to(from.el, { opacity: 0, x: dir * -50, duration: .35, ease: 'power2.in' }, 0)
      gsap.set(to.el, { x: dir * 50, opacity: 0 })
      tl.to(to.el,   { opacity: 1, x: 0,       duration: .4,  ease: 'power3.out' }, .28)
      // Ken Burns on incoming
      gsap.fromTo(to.img, { scale: 1.05 }, { scale: 1, duration: 3.5, ease: 'power1.out' })
    } else {
      gsap.set(from.el, { opacity: 0, x: 0 })
      gsap.set(to.el,   { opacity: 1, x: 0 })
    }

    this.current = idx
    this._updateHUD()
    if (this.onChange) this.onChange(this.photos[idx])
  }

  /* ── HUD sync ──────────────────────────────────────────────────────── */
  _updateHUD() {
    const p = this.photos[this.current]

    // Dots
    this._dots.forEach((d, i) => d.classList.toggle('on', i === this.current))

    // Tabs
    this._tabs?.forEach(t => t.classList.toggle('active', t.textContent === p.cat))

    // Counter
    document.getElementById('counter').textContent = `${this.current + 1} / ${this.photos.length}`

    // Animate counter
    const c = document.getElementById('counter')
    gsap.fromTo(c, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: .3 })
  }

  /* ── Helpers for hotspot positioning ───────────────────────────────── */
  getImageArea() {
    const stage = document.getElementById('stage')
    const { img } = this._els[this.current]
    if (!img || !img.naturalWidth) return null

    const cW = stage.clientWidth,  cH = stage.clientHeight
    const iW = img.naturalWidth,   iH = img.naturalHeight
    const cR = cW / cH, iR = iW / iH
    let dW, dH, dX, dY

    if (cR > iR) { dH = cH; dW = cH * iR; dX = (cW - dW) / 2; dY = 0 }
    else          { dW = cW; dH = cW / iR; dX = 0; dY = (cH - dH) / 2 }

    return { dW, dH, dX, dY }
  }

  getCurrentSrc() {
    return this._els[this.current]?.img.src || ''
  }
}
