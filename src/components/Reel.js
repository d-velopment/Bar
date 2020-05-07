import { SYMBOL, SLOTMACHINE } from './Config'
import Symbol from './Symbol'

export default class Reel {
	constructor(id) {
		this.id = id
		
		this.width = SYMBOL.WIDTH
		this.height = SYMBOL.HEIGHT * SLOTMACHINE.ROWS
		this.position = {
			x: id * (this.width),
			y: 0
		}
		this.symbols = []

		this.container = new PIXI.Container()
		this.container.position = this.position
		//this.container.pivot.x = this.width / 2
		//this.container.pivot.y = this.height / 2

		var bg = new PIXI.Graphics().beginFill(0x8bc5ff).drawRect(0,0, this.width, this.height).endFill();
		this.container.addChild(bg)

	}

	getStripeByOffset(topOffset) {
		return SLOTMACHINE.STRIPES[this.id].stripe.slice(topOffset, SLOTMACHINE.STRIPES[this.id].stripe.length).concat(SLOTMACHINE.STRIPES[this.id].stripe.slice(0, topOffset))
	}

	drawReel(topOffset) {
		this.symbols = []
		for(let i = -1; i < SLOTMACHINE.ROWS + 1; i++) {
			const drawSymbol = new Symbol(this.getStripeByOffset(topOffset + i)[0])
			drawSymbol.container.y = i * SYMBOL.HEIGHT
			this.symbols.push(drawSymbol)
			this.container.addChild(drawSymbol.container)
		}
		return this
	}

}