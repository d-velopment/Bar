import { APP, PAYLINES } from './Config'

export default class Balance {
  constructor () {
    this.amount = document.getElementById('balance')
    this.amount.value = PAYLINES.BALANCE

    this.bet = document.getElementById('bet')
    this.bet.value = PAYLINES.BET

    this.win = document.getElementById('win')
    this.win.value = ''

    document.addEventListener('Stop', (event) => {
      if (APP.DEBUG) console.log('>>> BALANCE ON STOP', event)
      this.amount.disabled = false
      this.bet.disabled = false
    })

    document.addEventListener('Spin', (event) => {
      if (APP.DEBUG) console.log('>>> BALANCE ON SPIN', event)
      this.amount.value = (this.amount.value.length === 0) ? 0 : this.amount.value
      this.bet.value = (this.bet.value.length === 0) ? 0 : this.bet.value
      const newAmount = parseInt(this.amount.value) - parseInt(this.bet.value)
      if (newAmount < 0) {
        window.alert('NOT ENOUGH MONEY TO SPIN')
        event.preventDefault()
        this.amount.disabled = false
        this.bet.disabled = false
        return
      }
      new TimelineMax()
        .to(this.amount, 0.25, { value: newAmount, roundProps: ['value'], ease: Linear.easeNone }, 0)

      this.win.value = ''
      this.amount.disabled = true
      this.bet.disabled = true
    })
  }
}
