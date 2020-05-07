import Stage from './components/Stage'
import Loader from './components/Loader'
import SlotMachine from './components/SlotMachine'

export default class Game extends Stage {

  constructor() {
    super()
    window.game = this
		this.width = window.innerWidth
		this.height = window.innerHeight
    this.createRenderer()
		new Loader(this.init.bind(this))
  }

  init() {
    console.log('OK')

    this.addElement(new SlotMachine([0,2,4]))

    this.animate()
  }

}
