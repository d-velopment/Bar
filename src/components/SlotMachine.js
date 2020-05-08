import { APP, SYMBOL, SLOTMACHINE } from './Config'
import Reel from './Reel'

export default class SlotMachine {
	constructor(display) {

		this.display = display
		this.width = SYMBOL.WIDTH * SLOTMACHINE.COLS
		this.height = SYMBOL.HEIGHT * SLOTMACHINE.ROWS
		this.position = { x: 0, y: 0 }
		this.reels = []

		this.container = new PIXI.Container()
		this.container.position = this.position
		this.container.pivot.x = this.width / 2
		this.container.pivot.y = this.height / 2

		if (APP.DEBUG) {
			var bg = new PIXI.Graphics().beginFill(0xe000e0).drawRect(0,0, this.width, this.height).endFill()
			this.container.addChild(bg)
		}

		game.slotMachine = this

		if (display !== undefined) {
			this.drawSlotMachine(display)
		}

		document.addEventListener("Spin", (event) => { 
			if (APP.DEBUG) console.log(">>> SPIN", event)
			this.spinSlotMachine(event.detail.display)
		})

	}

	drawSlotMachine(display) {
		this.reels = []
		for(let x = 0; x < SLOTMACHINE.COLS; x++) {

			const newReel = new Reel(x)
			this.reels.push(newReel.drawReel(display[x]))
			this.container.addChild(newReel.container)

		}
		return this
	}

	spinSlotMachine(display) {
		const timeline = new TimelineMax()

		let _display = (display !== undefined) ? display : []

		game.slotMachine.reels.forEach((reel, index) => {
			_display.push(Math.floor(Math.random() * 5))
			timeline.add(reel.spinReel(_display[index]), index * 0.1)
		})

		this.display = _display.slice(0, 3)
		if (APP.DEBUG) console.log('>>> DISPLAY', this.display)

		timeline.add(() => { 
			if (APP.DEBUG) console.log('>>> DISPATCH STOP')
			document.dispatchEvent(new CustomEvent("Stop", { 
				detail: { display: this.display }
			}))
		})
		return timeline
	}
}
