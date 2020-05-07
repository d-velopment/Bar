import { SYMBOL, SLOTMACHINE } from './Config'
import Symbol from './Symbol'

export default class Reel {
	constructor(id) {
		this.id = id
		this._offset = 0
		this._switch = 0
		this.width = SYMBOL.WIDTH
		this.height = SYMBOL.HEIGHT * SLOTMACHINE.ROWS
		this.position = { x: id * (this.width), y: 0 }
		this.symbols = []

		this.container = new PIXI.Container()
		this.container.position = this.position

		var bg = new PIXI.Graphics().beginFill(0x8bc5ff).drawRect(0,0, this.width, this.height).endFill();
		this.container.addChild(bg)

		console.log('>>> REEL', id, this)
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

	get offset() {
		return this._offset
	}
	set offset(value) {
		this._offset = value
		this.container.y = value % SYMBOL.HEIGHT

		const _newSwitch = Math.floor(value / SYMBOL.HEIGHT)
		console.log('>>> SWITCH', _newSwitch, this._switch)
		if (_newSwitch !== this._switch) {
			this._switch = _newSwitch

			/*
			const symbols = this.container.children.filter(item => item.children.length !== 0)
			symbols.forEach((item, index) => {
				if (index !== 0) {
					symbols[symbols.length-index].children[0].texture = symbols[symbols.length-index-1].children[0].texture
				}
			})
			*/

			this.symbols.forEach((item, index) => {
				if (index !== 0) {
					// this.symbols[this.symbols.length-index].container.children[0].texture = this.symbols[this.symbols.length-index-1].container.children[0].texture
					// this.symbols[this.symbols.length-index].id = this.symbols[this.symbols.length-index-1].id
					this.symbols[this.symbols.length-index].setTexture(this.symbols[this.symbols.length - index - 1].id)
				}
			})
			this.symbols[0].setTexture(this.getStripeByOffset(this.symbols[0].id - 1)[0])
			console.log(this.symbols)
		}
		
	}

	startSpin(topOffset) {
		new TimelineMax()
			.set(temp1, { offset: 0, immediateRender: false })
			.to(temp1, 0.25, { offset: -10 })
			.to(temp1, 2, { offset: 4000, ease: Linear.easeNone })
			.to(temp1, 2, { offset: 5100, ease: Power2.easeOut })
			.to(temp1, 1, { offset: 5040, ease: Power2.easeIn })
	}

	animateDown(callback) {

		/*
		const symbols = this.container.children.filter(item => item.children.length !== 0)

		symbols.forEach(item => {
			item.y += 0
		})

		console.log(symbols[0].y)
		if (symbols[0].y >= 0) {
			symbols.forEach(item => {
				item.y -= SYMBOL.HEIGHT
			})
		}*/

		// this.container.y = (this.container.y + 1) % SYMBOL.HEIGHT
		
		requestAnimationFrame(this.animateDown.bind(this, callback))
	}

}