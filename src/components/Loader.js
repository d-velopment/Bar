export default class Loader {
	constructor(callBack) {
		this.loader = PIXI.loader

		this.loader.add('Cherry', '../../assets/Cherry.png')
		this.loader.add('7', '../../assets/7.png')
		this.loader.add('BAR', '../../assets/BAR.png')
		this.loader.add('2xBAR', '../../assets/2xBAR.png')
		this.loader.add('3xBAR', '../../assets/3xBAR.png')
		
		this.loader.load(callBack)
	}
}