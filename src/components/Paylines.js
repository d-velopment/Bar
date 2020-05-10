import { APP, SYMBOL, SLOTMACHINE, PAYLINES } from './Config'
import { getStripeByOffset } from './Reel'
import { reelsShift } from './SlotMachine'
import { winPlates } from './Paytable'
import { TimelineMax, Linear } from 'gsap'

const arrayTranspose = arr => arr.map((col, i) => arr.map(row => row[i]))

export default class Paylines {
  constructor () {
    this.width = SYMBOL.WIDTH * SLOTMACHINE.COLS
    this.height = SYMBOL.HEIGHT * SLOTMACHINE.ROWS
    this.position = { x: 0, y: 0 }
    this.cells = []
    this.winLines = []
    this.winAmount = 0
    this.iterateTimeline = null

    this.paytable = new PIXI.Container()
    this.paytable.position = { x: this.width, y: 0 }
    this.paytable.pivot.x = this.width / 4
    this.paytable.pivot.y = this.height / 2
    const bg = new PIXI.Graphics().beginFill(0xff00ff).drawRect(0, 0, this.width / 2, this.height).endFill()
    bg.alpha = 0.25
    this.paytable.addChild(bg)

    this.container = new PIXI.Container()
    this.container.position = this.position
    this.container.pivot.x = this.width / 2
    this.container.pivot.y = this.height / 2

    if (APP.DEBUG) {
      const bg = new PIXI.Graphics().beginFill(0x0000ff).drawRect(0, 0, this.width, this.height).endFill()
      bg.alpha = 0.125
      this.container.addChild(bg)
    }

    game.paylines = this

    document.addEventListener('Spin', (event) => {
      if (event.defaultPrevented) return
      if (APP.DEBUG) console.log('>>> PAYLINES ON SPIN', event)
      this.resetPaylines()
    })

    document.addEventListener('Stop', (event) => {
      if (APP.DEBUG) console.log('>>> PAYLINES ON STOP', event)
      this.playPaylines(event.detail.display)
    })
  }

  resetPaylines () {
    if (this.iterateTimeline !== null) {
      this.iterateTimeline.stop()
      this.iterateTimeline.kill()
      this.iterateTimeline = null
    }
    this.winLines.forEach((line, index) => {
      winPlates[line.id].alpha = 0
      line.drawLine.forEach(draw => this.container.removeChild(draw))
    })
    this.winLines = []
  }

  getSlotMachineCells (display) {
    const reelStripes = display.map((element, index) => (
      getStripeByOffset(index, element).slice(0, SLOTMACHINE.ROWS)
    ))
    reelStripes.map((stripe, row) => {
      stripe.map((element, index) => {
        stripe.splice(index * 2 + (reelsShift[row] ? 0 : 1), 0, null)
      })
    })
    return arrayTranspose(reelStripes)
  }

  calculatePaylines (display) {
    this.cells = this.getSlotMachineCells(display)
    if (APP.DEBUG) console.log('>>> CELLS', this.cells)

    this.winLines = []
    this.winAmount = 0

    this.cells.forEach((symbols, currentRow) => {
      if (APP.DEBUG) console.log('>>> ROW', currentRow, symbols)
      PAYLINES.LIST.forEach(payline => {
        const winLine = JSON.parse(JSON.stringify(payline))
        const matchPositions = []

        const currentSymbols = symbols.slice()

        payline.symbols.forEach((symbol, index) => {
          const position = currentSymbols.findIndex(element => element === symbol)

          if (position !== -1) {
            matchPositions.push(position)
            currentSymbols[position] = -1
          }
        })

        if ((matchPositions.length === payline.symbols.length) &&
        (currentRow === (payline.row === undefined ? currentRow : payline.row))) {
          winLine.rowFound = currentRow
          winLine.positions = matchPositions
          if (APP.DEBUG) console.log('    >>> PAYLINE', winLine)
          this.winAmount += payline.win
          this.winLines.push(winLine)
        }
      })
    })

    const betAmount = parseInt(balance.bet.value)
    const wonAmount = this.winAmount * betAmount
    const isBigWin = betAmount === 0 ? false : ((wonAmount / parseInt(balance.bet.value) >= PAYLINES.BIGWINTHRESHOLD))

    if (wonAmount !== 0) {
      new TimelineMax()
        .add(() => { balance.win.value = 0 })
        .to(balance.win, isBigWin ? 3 : Math.min(0.5, wonAmount / 100), { value: wonAmount, roundProps: ['value'], ease: Linear.easeNone })
        .to(balance.amount, isBigWin ? 3 : Math.min(0.5, wonAmount / 100), { value: parseInt(balance.amount.value) + wonAmount, roundProps: ['value'], ease: Linear.easeNone }, 0)
    }
    return this.winLines.length !== 0
  }

  drawPaylines () {
    const thickness = 8
    this.winLines.forEach((line, index) => {
      const drawLine = new PIXI.Graphics().beginFill(0xffffff)
        .drawRoundedRect(0, (SYMBOL.HEIGHT / 2) + SYMBOL.HEIGHT / 2 + (line.rowFound) * (SYMBOL.HEIGHT / 2) - thickness / 2,
          SLOTMACHINE.COLS * SYMBOL.WIDTH, thickness, 4).endFill()
      drawLine.alpha = 0
      this.container.addChild(drawLine)

      this.winLines[index].drawLine = []
      this.winLines[index].drawLine.push(drawLine)

      line.positions.forEach(position => {
        const drawSquare = new PIXI.Graphics().beginFill(0xffffff, 0).lineStyle(thickness, 0xff0000)
          .drawRoundedRect(position * SYMBOL.WIDTH, SYMBOL.HEIGHT / 2 + (line.rowFound) * (SYMBOL.HEIGHT / 2), SYMBOL.WIDTH, SYMBOL.HEIGHT, thickness * 2)
        drawSquare.alpha = 0
        this.container.addChild(drawSquare)

        this.winLines[index].drawLine.push(drawSquare)
      })
    })
    if (APP.DEBUG) console.log('>>> DRAWLINES', this.winLines)
  }

  iteratePaylines () {
    this.iterateTimeline = new TimelineMax({ repeat: -1 })
    this.winLines.forEach((line, index) => {
      this.iterateTimeline
        .addLabel(`win${index}`)
        .to(line.drawLine, 0.25, { alpha: 1 }, `win${index}`)
        .to(winPlates[line.id], 0.25, { alpha: 1 }, `win${index}`)
        .to(line.drawLine, 0.75, { })
        .addLabel(`hide${index}`)
        .to(line.drawLine, 0.25, { alpha: 0 }, `hide${index}`)
        .to(winPlates[line.id], 0.25, { alpha: 0 }, `hide${index}`)
    })
    return this.iterateTimeline
  }

  playPaylines (display) {
    if (!this.calculatePaylines(display)) return
    if (APP.DEBUG) console.log('>>> PAYLINES', this.winLines)
    this.drawPaylines()
    this.iteratePaylines()
  }
}
