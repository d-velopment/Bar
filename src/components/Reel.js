import Symbol from './Symbol'

export default class Reel {
	constructor(id) {
		this.id = id

		this.cols = 3
		this.rows = 3
		this.cellSize = [200, 140]
		
		this.stripes = [
			{ id: 0, stripe: [0, 1, 2, 3, 4] },
			{ id: 1, stripe: [0, 1, 2, 3, 4] },
			{ id: 2, stripe: [0, 1, 2, 3, 4] },
		]
		
		this.width = this.cellSize[0]
		this.height = this.cellSize[1] * this.rows
		this.position = {
			x: (id-1) * (this.width),
			y: 0
		}
		this.symbols = []

		this.container = new PIXI.Container()
		this.container.position.x = this.position.x
		this.container.position.y = this.position.y
		this.container.pivot.x = this.width / 2
		this.container.pivot.y = this.height / 2

		var bg = new PIXI.Graphics().beginFill(0x8bc5ff).drawRect(0,0, this.width, this.height).endFill();
		this.container.addChild(bg)

	}

	getStripeByOffset(topOffset) {
		return this.stripes[this.id].stripe.slice(topOffset, this.stripes[this.id].stripe.length).concat(this.stripes[this.id].stripe.slice(0, topOffset))
	}

	drawReel(topOffset) {
		this.symbols = []
		for(let i = 0; i < this.rows; i++) {
			const drawSymbol = new Symbol(this.getStripeByOffset(topOffset + i)[0])
			drawSymbol.container.y = i * this.cellSize[1]
			this.symbols.push(drawSymbol)
			this.container.addChild(drawSymbol.container)
		}
		return this
	}
}