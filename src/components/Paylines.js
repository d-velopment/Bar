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
    
    this.cells.forEach((symbols, currentRow) => {
      console.error('>', currentRow, symbols)
      PAYLINES.LIST.forEach(payline => {
        
        let winLine = JSON.parse(JSON.stringify(payline))

        // console.log('>>>', payline, payline.row)
        // 1.FIXED ROWS
        if ((payline.row == currentRow) && (arrayMatch(payline.symbols, symbols))) {
          winLine.rowFound = currentRow
          winLine.positions = [0, 1, 2]
          console.warn('>>>>>> FIXED', winLine)
          this.winLines.push(winLine)
        }

        // 2.NO ROWS SET, FULL LENGTH
        if ((payline.row == undefined) && (symbols.length == payline.symbols.length) && (arrayMatch(payline.symbols, symbols))) {
          winLine.rowFound = currentRow
          winLine.positions = [0, 1, 2]
          console.warn('>>>>>> FULL', winLine)
          this.winLines.push(winLine)
        }

        // 3.NO ROWS SET, ANY SYMBOLS
        if ((payline.row == undefined) && (symbols.length !== payline.symbols.length)) {
          
          let matchPositions = []
          // console.log(payline.symbols)

          let currentSymbols = symbols.slice()

          payline.symbols.forEach((symbol, index) => {
            const position = currentSymbols.findIndex(element => element == symbol)
            if (position !== -1) {
              matchPositions.push(position)
              currentSymbols[position] = -1
              // console.log(currentSymbols, symbol, matchPositions)
            }
          })
        
          if (matchPositions.length == payline.symbols.length) {
            winLine.rowFound = currentRow
            winLine.positions = matchPositions
            console.warn('>>>>>> ANY', symbols, winLine)
            this.winLines.push(winLine)
          }

        }

      })
    })
    if (APP.DEBUG) console.log('>>> CELLS', this.cells)
    console.log(this.winLines)
  }

}
