import { APP, SYMBOL, SLOTMACHINE, PAYLINES } from './Config'

export var winPlates = []

export default class Paytable {
  constructor () {
    this.width = SYMBOL.WIDTH * SLOTMACHINE.COLS
    this.height = SYMBOL.HEIGHT * SLOTMACHINE.ROWS
    this.position = { x: -14, y: 0 }
    this.textures = SYMBOL.LIST.filter(item => item.id !== undefined).map(item => ({ id: item.id, texture: PIXI.loader.resources[item.name].texture }))

    this.container = new PIXI.Container()
    this.container.position = this.position
    this.container.pivot.x = this.width / 2
    this.container.pivot.y = this.height / 2

    if (APP.DEBUG) {
      const bg = new PIXI.Graphics().beginFill(0xff00ff).drawRect(0, 0, -this.width / 2, this.height).endFill()
      bg.alpha = 0.125
      this.container.addChild(bg)
    }

    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 32,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'],
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440
    })

    let highestWinWidth = -1
    PAYLINES.LIST.forEach((line, row) => {
      const bg = new PIXI.Graphics().beginFill(0xffffff).drawRect(0, row * 38, -this.width / 2, 39).endFill()
      bg.alpha = 0
      this.container.addChild(bg)
      winPlates.push(bg)

      const textId = new PIXI.Text(line.win, style)
      textId.x = -85
      textId.y = row * 38 - 3
      textId.anchor.set(0, 0)
      this.container.addChild(textId)

      highestWinWidth = (highestWinWidth === -1) ? textId.width + 5 : highestWinWidth

      line.symbols.forEach((id, col) => {
        const sprite = new PIXI.Sprite(this.textures[id].texture)
        sprite.anchor.set(1, 0)
        sprite.x = -highestWinWidth - col * 43
        sprite.y = row * 38
        sprite.scale = { x: 0.33, y: 0.33 }
        this.container.addChild(sprite)
      })
    })

    game.paytable = this
  }
}
