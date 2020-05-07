import { SYMBOL, SLOTMACHINE } from './Config'
import { TweenMax, TimelineLite, Power2, Elastic, CSSPlugin } from "gsap/TweenMax"
import Reel from './Reel'

export default class SlotMachine {
	constructor(display) {

		this.width = SYMBOL.WIDTH * SLOTMACHINE.COLS
		this.height = SYMBOL.HEIGHT * SLOTMACHINE.ROWS
		this.position = { x: 0, y: 0 }
		this.reels = []

		this.container = new PIXI.Container()
		this.container.position = this.position
		this.container.pivot.x = this.width / 2
		this.container.pivot.y = this.height / 2

		var bg = new PIXI.Graphics().beginFill(0xe000e0).drawRect(0,0, this.width, this.height).endFill();
		this.container.addChild(bg)

		if (display !== undefined) {
			this.drawSlotMachine(display)
		}
	}

	drawSlotMachine(display) {
		this.reels = []
		for(let x = 0; x < SLOTMACHINE.COLS; x++) {

			const newReel = new Reel(x)
			this.reels.push(newReel.drawReel(display[x]))
			this.container.addChild(newReel.container)
			newReel.animateDown(null)

		}
		return this
	}

	// new TimelineMax().to(game.stage.children[0].children[1], 1, { y: 0 })

}