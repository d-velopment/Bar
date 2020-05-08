import { SYMBOL } from "./Config"

export default class Symbol {
	constructor(id) {
		this.id = id

		this.width = SYMBOL.WIDTH
		this.height = SYMBOL.HEIGHT
		this.position = { x: 0, y: 0 }
		this.textures = SYMBOL.LIST.filter(item => item.id !== undefined).map(item => ({ id: item.id, texture: PIXI.loader.resources[item.name].texture }))
		
		this.container = new PIXI.Container()
		this.container.position.x = this.position.x
		this.container.position.y = this.position.y
		this.container.pivot.x = -this.width / 2
		this.container.pivot.y = -this.height / 2

		if (id !== undefined) {
			this.drawSymbol(id)
		}
	}

	setTexture(id) {
		this.container.children[0].texture = this.textures[id].texture
		this.id = id
	}

	drawSymbol(id) {
		this.id = id
		const sprite = new PIXI.Sprite(this.textures[id].texture)
		sprite.anchor.set(0.5)
		this.container.addChild(sprite)
		return this
	}
}
