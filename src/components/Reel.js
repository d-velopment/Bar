import { APP, SYMBOL, SLOTMACHINE } from './Config'
import Symbol from './Symbol'

export const getStripeByOffset = (id, topOffset) => {
  return [].concat(SLOTMACHINE.STRIPES[id].stripe.slice(topOffset, SLOTMACHINE.STRIPES[id].stripe.length).concat(SLOTMACHINE.STRIPES[id].stripe.slice(0, topOffset)))
}

export default class Reel {
  constructor (id) {
    this.id = id
    this.isMiddle = false
    this._offset = 0
    this._switch = 0
    this.width = SYMBOL.WIDTH
    this.height = SYMBOL.HEIGHT * SLOTMACHINE.ROWS
    this.position = { x: id * (this.width), y: 0 }
    this.symbols = []

    this.container = new PIXI.Container()
    this.container.position = this.position

    if (APP.DEBUG) {
      var bg = new PIXI.Graphics().beginFill(0x8bc5ff).drawRect(0, 0, this.width, this.height).endFill()
      this.container.addChild(bg)
      console.log('>>> REEL', id, this)
    }
  }

  drawReel (topOffset, isMiddle = false) {
    this.symbols = []
    this.isMiddle = isMiddle
    this._switch = topOffset + SLOTMACHINE.STRIPES[this.id].stripe.length - 1 // 1 STRIPE LENGTH OFFSET FOR ROLLBACK PURPOSE
    this._offset = this._switch * SYMBOL.HEIGHT + (!this.isMiddle ? SYMBOL.HEIGHT / 2 : 0)
    for (let i = -1; i < SLOTMACHINE.ROWS + 1; i++) {
      const drawSymbol = new Symbol(getStripeByOffset(this.id, topOffset + i)[0])
      drawSymbol.container.y = i * SYMBOL.HEIGHT
      this.symbols.push(drawSymbol)
      this.container.addChild(drawSymbol.container)
    }
    return this
  }

  get offset () {
    return this._offset
  }

  set offset (value) {
    this.container.y = value % SYMBOL.HEIGHT
    this._offset = value

    const _newSwitch = Math.floor(value / SYMBOL.HEIGHT)

    if (_newSwitch !== this._switch) {
      const delta = _newSwitch - this._switch
      this._switch = _newSwitch

      if (delta > 0) {
        this.symbols.forEach((item, index) => {
          if (index !== 0) {
            this.symbols[this.symbols.length - index].setTexture(this.symbols[this.symbols.length - index - 1].id)
          }
        })
        this.symbols[0].setTexture(getStripeByOffset(this.id, this.symbols[0].id - 1)[0])
      }
      if (delta < 0) {
        this.symbols.forEach((item, index) => {
          if (index !== (this.symbols.length - 1)) {
            this.symbols[index].setTexture(this.symbols[index + 1].id)
          }
        })
        this.symbols[this.symbols.length - 1].setTexture(getStripeByOffset(this.id, this.symbols[this.symbols.length - 1].id + 1)[0])
      }
    }
  }

  spinReel (topOffset, isMiddle = false) {
    this.wasMiddle = this.isMiddle
    this.isMiddle = isMiddle

    const shift = (this.isMiddle && this.wasMiddle) ? SYMBOL.HEIGHT
      : (this.isMiddle && !this.wasMiddle) ? (SYMBOL.HEIGHT / 2)
        : (!this.isMiddle && this.wasMiddle) ? (SYMBOL.HEIGHT / 2)
          : (!this.isMiddle && !this.wasMiddle) ? 0
            : 0

    const duration = 2.5 + this.id * 0.5
    const getStartSymbol = getStripeByOffset(this.id, topOffset - this.symbols[1].id)[0]
    const nextOffset = (SLOTMACHINE.STRIPES[this.id].stripe.length) * (7 + this.id * 2) - getStartSymbol // VISUALLY BEST SPIN SCENARIO
    if (APP.DEBUG) console.log('>>> SHIFT', this.id, isMiddle, topOffset)
    return new TimelineMax()
      .to(this, duration * 0.45, { offset: `+=${nextOffset * SYMBOL.HEIGHT * 0.75}`, ease: Linear.easeNone })
      .to(this, duration * 0.5, { offset: `+=${nextOffset * SYMBOL.HEIGHT * 0.25 + shift + 50}`, ease: Power2.easeOut })
      .to(this, duration * 0.25, { offset: '-=50', ease: Bounce.easeOut })
      .add(() => {
        if (APP.DEBUG) { console.log('>>> AFTER', this.symbols) }
      })
  }
}
