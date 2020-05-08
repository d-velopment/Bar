import { APP } from './Config'

export default class Stage {
  constructor () {
    this.width = null
    this.height = null
    this.view = new PIXI.Container()
    this.stage = this.view.addChild(new PIXI.Container())
  }

  createRenderer () {
    this.renderer = PIXI.autoDetectRenderer(this.width, this.height, {
      antialias: true
    },false, true)
    this.stage.pivot.x = -this.width / 2
    this.stage.pivot.y = -this.height / 2
    document.body.appendChild(this.renderer.view)
    this.renderer.render(this.stage)
  }

  addMask (element) {
    if (APP.DEBUG) return
    var bg = new PIXI.Graphics().beginFill(0xe0e000).drawRect(0, 0, element.width, element.height).endFill()
    element.container.addChild(bg)
    element.container.mask = bg
  }

  addElement (item) {
    this.stage.addChild(item.container)
    this.renderer.render(this.stage)
  }

  runAnimate () {
    global.requestAnimationFrame(this.runAnimate.bind(this))
    this.renderer.render(this.stage)
  }
}
