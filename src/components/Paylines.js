import { APP, SYMBOL, SLOTMACHINE, PAYLINES } from './Config'
import { getStripeByOffset } from './Reel'

const arrayTranspose = arr => arr.map((col, i) => arr.map(row => row[i]))
const arrayMatch = (arr, target) => target.every(v => arr.includes(v))

export default class Paylines {
  constructor () {
    this.width = SYMBOL.WIDTH * SLOTMACHINE.COLS
    this.height = SYMBOL.HEIGHT * SLOTMACHINE.ROWS
    this.position = { x: 0, y: 0 }
    this.cells = []
    this.winLines = []

    this.container = new PIXI.Container()
    this.container.position = this.position
    this.container.pivot.x = this.width * 0.95 / 2
    this.container.pivot.y = this.height * 0.95 / 2

    if (APP.DEBUG) {
      var bg = new PIXI.Graphics().beginFill(0x0000ff).drawRect(0, 0, this.width * 0.95, this.height * 0.95).endFill()
      bg.alpha = 0.125
      this.container.addChild(bg)
    }

    game.paylines = this

    document.addEventListener('Stop', (event) => {
      if (APP.DEBUG) console.log('>>> PAYLINES ON STOP', event)
      this.playPaylines(event.detail.display)
    })
  }

  getSlotMachineCells (display) {
    return arrayTranspose(display.map((element, index) => (
      getStripeByOffset(index, element).slice(0, SLOTMACHINE.ROWS)
    )))
  }

  playPaylines (display) {
    this.cells = this.getSlotMachineCells(display)
    if (APP.DEBUG) console.log('>>> CELLS', this.cells)

    this.winLines = []
    this.cells.slice().forEach((symbols, currentRow) => {
      console.log('>', currentRow, symbols)
      PAYLINES.LIST.forEach(payline => {
        
        console.log('>>>', payline, payline.row)
        // 1.FIXED ROWS
        if ((payline.row == currentRow) && (arrayMatch(payline.symbols, symbols))) {
          payline.rowFound = currentRow
          console.log('>>>>>> FIXED', payline)
          this.winLines.push(payline)
        }

        // 2.NO ROWS SET, LENGTH EQUAL
        if ((payline.row == undefined) && (symbols.length == payline.symbols.length) && (arrayMatch(payline.symbols, symbols))) {
          payline.rowFound = currentRow
          console.log('>>>>>> EQUAL', payline)
          this.winLines.push(payline)
        }

        // 3.NO ROWS SET, ANY SYMBOLS
        if ((payline.row == undefined) && (symbols.length !== payline.symbols.length)) {
          let matchPositions = []
          console.log(payline.symbols)
          payline.symbols.forEach((symbol, index) => {
            console.log(symbols, symbol)
            const position = symbols.findIndex(element => element == symbol)
            if (position !== -1) {
              matchPositions.push(position)
              symbols[position] = -1
            }
          })
          
          if (matchPositions.length == payline.symbols.length) {
            payline.rowFound = currentRow
            payline.positions = matchPositions
            console.log('>>>>>> ANY', symbols, payline)
            this.winLines.push(payline)
          }
        }

      })
    })
    if (APP.DEBUG) console.log('>>> CELLS', this.cells)
    console.log(this.winLines)
  }

}
