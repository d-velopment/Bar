export default class Stage {
	constructor() {
		this.width = null;
		this.height = null;
		this.stage = new PIXI.Container();
	}

	createRenderer() {
		this.renderer = PIXI.autoDetectRenderer(this.width, this.height)
		this.stage.pivot.x = -this.width / 2
		this.stage.pivot.y = -this.height / 2
		document.body.appendChild(this.renderer.view)
		this.renderer.render(this.stage)
	}

	addElement(item) {
		this.stage.addChild(item.container)
		this.renderer.render(this.stage)
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.renderer.render(this.stage);
	}

}