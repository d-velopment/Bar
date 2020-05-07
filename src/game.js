import Stage from './components/Stage'
import Loader from './components/Loader'
import Reel from './components/Reel'

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
    
    /* 
    const testSymbol = new Symbol(0)
    console.log(testSymbol)
    this.addElement(testSymbol)
    */

    this.addElement(new Reel(0).drawReel(2))
    this.addElement(new Reel(1).drawReel(0))
    this.addElement(new Reel(2).drawReel(4))

  }

}
