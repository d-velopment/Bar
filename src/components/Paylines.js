import { APP, SYMBOL, SLOTMACHINE } from './Config'

export default class Paylines {
  constructor () {
    this.width = SYMBOL.WIDTH * SLOTMACHINE.COLS
    this.height = SYMBOL.HEIGHT * SLOTMACHINE.ROWS
    this.position = { x: 0, y: 0 }
    this.reels = []

    this.container = new PIXI.Container()
    this.container.position = this.position
    this.container.pivot.x = this.width * 0.95 / 2
    this.container.pivot.y = this.height * 0.95 / 2

    if (APP.DEBUG) {
      var bg = new PIXI.Graphics().beginFill(0x0000ff).drawRect(0, 0, this.width * 0.95, this.height * 0.95).endFill()
      bg.alpha = 0.125
      this.container.addChild(bg)
    }

    game.paylines = this

    document.addEventListener('Stop', (event) => {
      if (APP.DEBUG) console.log('>>> PAYLINES ON STOP', event)
      this.playPaylines(event.detail.display)
    })
  }

  playPaylines (display) {

  }
}
