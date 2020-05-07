import Stage from './components/Stage'
import Loader from './components/Loader'
import Symbol from './components/Symbol'

export default class Game extends Stage {

  constructor() {
		super()
		this.width = window.innerWidth
		this.height = window.innerHeight
    this.createRenderer()
    console.log('>>> GAME', this)
		new Loader(this.init.bind(this))
  }

  init() {
    console.log('OK')
    const testSymbol = new Symbol(0)
    console.log(testSymbol)
    this.addElement(testSymbol)
  }

}
