import { APP } from './components/Config'
import Stage from './components/Stage'
import Loader from './components/Loader'
import SlotMachine from './components/SlotMachine'
import SpinButton from './components/SpinButton'
import Paylines from './components/Paylines'

export default class Game extends Stage {
  constructor () {
    /* eslint-disable no-new */
    super()
    window.game = this
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.createRenderer()
    new Loader(this.init.bind(this))
  }

  init () {
    const slotMachine = new SlotMachine([0, 2, 4])
    this.addElement(slotMachine)
    this.addMask(slotMachine)

    this.addElement(new Paylines())

    this.addElement(new SpinButton())
    
    this.runAnimate()
    if (APP.DEBUG) console.log('>>> READY')
  }
}
