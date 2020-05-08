export const APP = {
  DEBUG: false
}

export const SYMBOL = {
  WIDTH: 180,
  HEIGHT: 140,
  LIST: [
    { id: 0, name: '3xBAR' },
    { id: 1, name: 'BAR' },
    { id: 2, name: '2xBAR' },
    { id: 3, name: '7' },
    { id: 4, name: 'Cherry' },
    { name: 'Spin' }
  ]
}

export const SLOTMACHINE = {
  COLS: 3,
  ROWS: 3,
  STRIPES: [
    { id: 0, stripe: [0, 1, 2, 3, 4] },
    { id: 1, stripe: [0, 1, 2, 3, 4] },
    { id: 2, stripe: [0, 1, 2, 3, 4] }
  ]
}

export const PAYLINES = {
  LIST: [
    { id: 0, row: 0, symbols: [4, 4, 4], win: 2000 },
    { id: 1, row: 1, symbols: [4, 4, 4], win: 1000 },
    { id: 2, row: 2, symbols: [4, 4, 4], win: 4000 },
    { id: 3, symbols: [3, 3, 3], win: 150 },
    { id: 4, symbols: [4, 3], win: 75 },
    { id: 5, symbols: [0, 0, 0], win: 50 },
    { id: 6, symbols: [2, 2, 2], win: 20 },
    { id: 7, symbols: [1, 1, 1], win: 10 },
    { id: 8, symbols: [1, 2], win: 5 },
    { id: 9, symbols: [1, 0], win: 5 },
    { id: 10, symbols: [2, 0], win: 5 }
  ],
  BALANCE: 5000,
  BET: 1
}
