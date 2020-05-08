import { APP, SYMBOL } from './Config'

export default class Loader {
  constructor (callBack) {
    this.loader = PIXI.loader // eslint-disable-line

    SYMBOL.LIST.forEach(item => {
      this.loader.add(item.name, `../../assets/${item.name}.png`)
      if (APP.DEBUG) console.log('>>> TEXTURE', item.name)
    })
    this.loader.load(callBack)
  }
}
