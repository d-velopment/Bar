import { APP, SYMBOL, SLOTMACHINE } from './Config'
import { TimelineMax, Elastic } from 'gsap'
import { getStripeByOffset } from './Reel'

export default class SpinButton {
  constructor () {
    this.position = { x: SYMBOL.WIDTH * 3 / 2, y: SYMBOL.HEIGHT * 3 / 2 }
    this.container = new PIXI.Container()
    this.container.position = this.position

    if (APP.DEBUG) {
      var bg = new PIXI.Graphics().beginFill(0xe0e000).drawRect(0, 0, SYMBOL.WIDTH, SYMBOL.HEIGHT).endFill()
      bg.pivot = { x: SYMBOL.WIDTH / 2, y: SYMBOL.HEIGHT / 2 }
      bg.alpha = 0.5
      this.container.addChild(bg)
    }

    const sprite = new PIXI.Sprite(PIXI.loader.resources.Spin.texture)
    sprite.anchor.set(0.5)
    this.container.addChild(sprite)

    this.alpha = this.initAlpha = 0.75
    this.clickAlpha = 0.90
    this.disabledAlpha = 0.50
    this.duration = 0.05

    this.container.on('mousedown', this.onClick.bind(this))
    this.container.on('mouseover', this.onHover.bind(this))
    this.container.on('mouseout', this.reset.bind(this))
    this.reset()

    document.addEventListener('Spin', (event) => {
      if (APP.DEBUG) console.log('>>> SPIN BUTTON ON SPIN (LISTEN TO ITSELF FOR CANCEL PURPOSES)', event)
      if (event.defaultPrevented) this.reset()
    })

    document.addEventListener('Stop', (event) => {
      if (APP.DEBUG) console.log('>>> SPIN BUTTON ON STOP', event)
      this.reset()
    })
  }

  onClick () {
    let _display
    const _reelsShift = []
    const force = document.getElementById('force').value
    if (force.length === 6) {
      _display = []
      for (let col = 0; col < SLOTMACHINE.COLS; col++) {
        const initialStripe = SLOTMACHINE.STRIPES[col].stripe
        const symbolOffset = getStripeByOffset(col, initialStripe.findIndex(item => item === parseInt(force[col * 2]) - Math.floor(force[col * 2 + 1] / 2)))
        _reelsShift.push(force[col * 2 + 1] % 2 !== 0)
        _display.push(symbolOffset[0])
      }
      if (APP.DEBUG) console.log('>>> FORCE DISPLAY', _display, _reelsShift)
    }

    this.container.interactive = false

    if (APP.DEBUG) console.log('>>> DISPATCH SPIN')
    document.dispatchEvent(new CustomEvent('Spin', {
      detail: { display: _display, reelsShift: _reelsShift },
      cancelable: true
    }))

    new TimelineMax()
      .to(this.container, this.duration * 2, { alpha: this.disabledAlpha })
      .to(this.container.scale, this.duration * 10, { x: 0.9, y: 0.9, ease: Elastic.easeOut }, 0)
  }

  onHover () {
    new TimelineMax()
      .to(this.container, this.duration, { alpha: this.clickAlpha })
      .to(this.container.scale, this.duration, { x: 1.1, y: 1.1 }, 0)
  }

  reset () {
    new TimelineMax()
      .to(this.container, this.duration, { alpha: this.initAlpha })
      .to(this.container.scale, this.duration, { x: 1.0, y: 1.0 }, 0)
      .add(() => {
        this.container.interactive = true
        this.container.interactiveChildren = true
      })
  }
}
