import gsap from 'gsap'

/* ── Hotspots par frame ──────────────────────────────────────────────────
   key: frame index (0-7)
   0=FRONT  1=AV-D  2=PROFIL-D  3=ARR-D  4=ARRIÈRE  5=ARR-G  6=PROFIL-G  7=AV-G
   ─────────────────────────────────────────────────────────────────────── */
export const HOTSPOTS_BY_FRAME = {
  0: [  // Face avant — bulle / phare / crash bars
    { x:50, y:15, t:'BULLE 5 POSITIONS',        d:'Réglage sur 5 hauteurs · Polycarbonate teinté anti-UV' },
    { x:50, y:46, t:'PHARE LED + ANTIBROUILLARD',d:'Double optique full LED + feux antibrouillard intégrés de série' },
    { x:50, y:74, t:'CRASH BARS',               d:'Protection tubulaire acier de série · Compatible valises latérales' },
  ],
  1: [  // Av. droite — TFT / caméra avant / fourche
    { x:57, y:21, t:'ÉCRAN TFT 8"',             d:'Couleur 8 pouces · Navigation GPS option · Bluetooth intégré' },
    { x:40, y:48, t:'CAMÉRA AVANT',             d:'Sony Starvis 1080p · Grand angle · Enregistrement continu de série' },
    { x:27, y:66, t:'FOURCHE USD Ø41mm',        d:'Inversée Ø41 mm · Débattement 154 mm · Réglage compression & détente' },
  ],
  2: [  // Profil droit — coffre / frein / amortisseur
    { x:63, y:36, t:'COFFRE 2 CASQUES',         d:'Loge 2 casques intégraux · Éclairage LED · Prise USB 5V/2A' },
    { x:25, y:67, t:'FREIN AVANT 260mm',        d:'Disque 260 mm · Étrier radial 4 pistons J.Juan · ABS Bosch' },
    { x:77, y:50, t:'AMORTISSEUR ARRIÈRE',      d:'Double amortisseur · Précharge réglable · Optimisé trail' },
  ],
  3: [  // Arr. droite — feu / réservoir / jante AR
    { x:54, y:31, t:'FEU ARRIÈRE LED',          d:'Full LED · Stop, position et clignotants en bloc optique unique' },
    { x:42, y:46, t:'RÉSERVOIR 17,5L',          d:'Contenance 17,5 litres · Autonomie ~450 km · Trappe électrique' },
    { x:68, y:70, t:'JANTE RAYONS 14"',         d:'Jante aluminium à rayons 14 pouces · Pneu mixte route / piste' },
  ],
  4: [  // Face arrière — caméra AR / ABS / TPMS
    { x:50, y:27, t:'CAMÉRA ARRIÈRE',           d:'Sony Starvis 1080p · Intégrée dans le feu arrière · De série' },
    { x:50, y:52, t:'ABS DÉCONNECTABLE',        d:'ABS Bosch 2 canaux · Mode off activable pour usage off-road' },
    { x:50, y:74, t:'TPMS DE SÉRIE',            d:'Capteurs pression pneus sur les 2 roues · Alerte temps réel sur TFT' },
  ],
  5: [  // Arr. gauche — béquille / CVT / échappement
    { x:57, y:70, t:'BÉQUILLE CENTRALE',        d:'De série · Acier traité · Facilite chargement et entretien' },
    { x:40, y:52, t:'CVT ECO / SPORT',          d:'Transmission automatique CVT · 2 modes conduite Eco et Sport' },
    { x:34, y:63, t:'ÉCHAPPEMENT',              d:'Collecteur inox · Silencieux aluminium anodisé · Norme Euro 5' },
  ],
  6: [  // Profil gauche — moteur / Bluetooth / garde au sol
    { x:36, y:60, t:'368cc SOHC 38,7 CH',      d:'Monocylindre SOHC · Refroidissement liquide · 40 Nm @ 6 000 rpm' },
    { x:39, y:28, t:'CONNECTIVITÉ BLUETOOTH',   d:'App Zontes Connect · Appels, musique, navigation sur TFT 8"' },
    { x:65, y:82, t:'GARDE AU SOL 180mm',       d:'180 mm de débattement · Franchissement hors-route facilité' },
  ],
  7: [  // Av. gauche — poignées / protège-mains / jante AV
    { x:27, y:32, t:'POIGNÉES CHAUFFANTES',     d:'Chauffage électrique de série · 3 niveaux · Commande au guidon' },
    { x:24, y:20, t:'PROTÈGE-MAINS',            d:'Monture aluminium de série · Protection vent et impacts' },
    { x:30, y:68, t:'JANTE RAYONS 17"',         d:'Jante aluminium à rayons 17 pouces · Pneu mixte avant' },
  ],
}

/* ── Fiche technique ─────────────────────────────────────────────────── */
const SPECS = [
  { cat:'MOTEUR', rows:[
    { k:'Cylindrée',        v:'368 cc' },
    { k:'Configuration',    v:'Mono SOHC 4T · Refroid. liquide' },
    { k:'Puissance maxi',   v:'38,7 ch @ 7 500 rpm', h:true },
    { k:'Couple maxi',      v:'40 Nm @ 6 000 rpm', h:true },
    { k:'Alimentation',     v:'Injection électronique · Euro 5' },
  ]},
  { cat:'TRANSMISSION', rows:[
    { k:'Boîte',            v:'CVT automatique', h:true },
    { k:'Modes conduite',   v:'Eco · Sport' },
    { k:'Contrôle traction',v:'TCS de série' },
  ]},
  { cat:'CHÂSSIS', rows:[
    { k:'Cadre',            v:'Acier renforcé' },
    { k:'Hauteur selle',    v:'790 mm (770 mm option)', h:true },
    { k:'Poids à sec',      v:'186 kg' },
    { k:'Poids en ordre',   v:'192 kg', h:true },
    { k:'Garde au sol',     v:'180 mm' },
    { k:'Réservoir',        v:'17,5 litres', h:true },
  ]},
  { cat:'SUSPENSIONS', rows:[
    { k:'Avant',  v:'USD Ø41 mm · Débatt. 154 mm · Réglable', h:true },
    { k:'Arrière',v:'Double amortisseur · Précharge réglable' },
  ]},
  { cat:'FREINAGE', rows:[
    { k:'Avant',  v:'Disque 260 mm · Étrier radial 4P J.Juan', h:true },
    { k:'ABS',    v:'Bosch 2 canaux · Déconnectable', h:true },
    { k:'TPMS',   v:'Capteurs pression pneus de série' },
  ]},
  { cat:'PNEUMATIQUES', rows:[
    { k:'Avant',  v:'Jante rayons 17" · Mixte route/piste' },
    { k:'Arrière',v:'Jante rayons 14" · Mixte route/piste' },
  ]},
  { cat:'ÉQUIPEMENT', rows:[
    { k:'Écran',            v:'TFT couleur 8"', h:true },
    { k:'Bluetooth',        v:'App Zontes Connect' },
    { k:'Caméras',          v:'Sony Starvis 1080p AV + AR', h:true },
    { k:'Éclairage',        v:'Full LED + antibrouillard' },
    { k:'Bulle',            v:'Réglable 5 positions' },
    { k:'Poignées',         v:'Chauffantes de série' },
    { k:'Démarrage',        v:'Keyless (sans clé)' },
    { k:'Coffre',           v:'2 casques intégraux + USB' },
    { k:'Béquille',         v:'Centrale de série' },
  ]},
]

/* ════════════════════════════════════════════════════════════════════════ */
export class UIManager {
  constructor() {
    this._panelOpen = false
    this._buildSpecs()
    this._bindPanel()
    this._bindFabs()
  }

  /* ── Fiche technique ─────────────────────────────────────────────── */
  _buildSpecs() {
    const body = document.getElementById('specs-body')
    SPECS.forEach(({ cat, rows }) => {
      const g = document.createElement('div')
      g.className = 'sg'
      g.innerHTML = `<div class="sg-title">${cat}</div>`
      rows.forEach(({ k, v, h }) => {
        const r = document.createElement('div')
        r.className = 'sr'
        r.innerHTML = `<span class="sk">${k}</span><span class="sv${h ? ' h' : ''}">${v}</span>`
        g.appendChild(r)
      })
      body.appendChild(g)
    })
  }

  _bindPanel() {
    const panel = document.getElementById('specs-panel')
    const btnO  = document.getElementById('btn-specs')
    const btnC  = document.getElementById('btn-close-specs')

    btnO.addEventListener('click', () => {
      panel.classList.add('open')
      btnO.classList.add('on')
      this._panelOpen = true
    })
    btnC.addEventListener('click', () => {
      panel.classList.remove('open')
      btnO.classList.remove('on')
      this._panelOpen = false
    })
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this._panelOpen) btnC.click()
    })
  }

  /* ── FABs ─────────────────────────────────────────────────────────── */
  _bindFabs() {
    const snd = document.getElementById('fab-sound')
    snd.addEventListener('click', () => {
      if (snd.classList.contains('on')) return
      snd.classList.add('on')
      this._rev()
      setTimeout(() => snd.classList.remove('on'), 5000)
    })

    const fs = document.getElementById('fab-fs')
    fs.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {})
        fs.classList.add('on')
      } else {
        document.exitFullscreen()
        fs.classList.remove('on')
      }
    })
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) fs.classList.remove('on')
    })
  }

  /* ── Engine sound — real Zontes 368G recording ──────────────────── */
  _rev() {
    if (!this._audio) {
      this._audio = new Audio('/sounds/engine.mp3')
    }
    const a = this._audio
    a.volume   = 0.9
    a.currentTime = 0
    clearTimeout(this._soundTimer)
    a.play().catch(() => {})
    /* fade out toward the end of the 5s clip */
    this._soundTimer = setTimeout(() => {
      const fadeSteps = 20
      let step = 0
      const fade = setInterval(() => {
        step++
        a.volume = Math.max(0, 0.9 * (1 - step / fadeSteps))
        if (step >= fadeSteps) { clearInterval(fade); a.pause(); a.volume = 0.9 }
      }, 30)
    }, 3800)
  }
}
