import gsap     from 'gsap'
import { Viewer360 }   from './showcase/Viewer360.js'
import { Hotspots }    from './ui/Hotspots.js'
import { UIManager }   from './ui/UIManager.js'
import { IntroScreen } from './ui/IntroScreen.js'

export class App {
  constructor() {
    this.viewer  = new Viewer360()
    this.hs      = new Hotspots(this.viewer)
    this.ui      = new UIManager()
    this.intro   = new IntroScreen()

    // Reposition hotspots after zoom so they stay on the bike
    this.viewer.onZoomChange = () => this.hs._reposition()

    // Play intro then reveal scene
    this.intro.play().then(() => {
      document.getElementById('scene').classList.add('visible')
    })
  }
}
