const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim().split('\n\n').map(n => n)

  const numbers = input.shift().split(',').map(n => Number.parseInt(n))
  const boards = () => {
    return input.map(b => {
      const board = []
      b.split('\n').forEach((l, li) => {
        l.trimStart().split(/\s+/).forEach((t, ti) => {
          const tile = {
            x: ti,
            y: li,
            num: parseInt(t),
            marked: false
          }
          board.push(tile)
        })
      })
      return board
    })
  }

  await solveForFirstStar(numbers, boards())
  await solveForSecondStar(numbers, boards())
}

const isBingo = (board) => {
  // Check rows
  for (let y = 0; y < 5; y++) {
    let count = 0
    for (let x = 0; x < 5; x++) {
      if (board.find(b => b.marked === true && b.x === x && b.y === y)) {
        count++
      } else break
    }
    if (count === 5) return true
  }

  // Check columns
  for (let x = 0; x < 5; x++) {
    let count = 0
    for (let y = 0; y < 5; y++) {
      if (board.find(b => b.marked === true && b.x === x && b.y === y)) {
        count++
      } else break
    }
    if (count === 5) return true
  }
  return false
}

const playGameTilFirstWin = (numbers, boards) => {
  let bingo = false
  let score = 0
  numbers.some(n => {
    boards.some((b, bi) => {
      const foundIndex = b.findIndex(t => t.num === n)
      if (foundIndex !== -1) b[foundIndex].marked = true
      bingo = isBingo(b)
      if (bingo === true) {
        const sumUnmarked = b.reduce((sum, tile) => {
          if (tile.marked === false) {
            return sum + tile.num
          } else {
            return sum
          }
        }, 0)
        score = sumUnmarked * b[foundIndex].num
      }
      return bingo === true
    })
    return bingo === true
  })
  return score
}

const playGameTilLastWin = (numbers, boards) => {
  const numberedBoards = []
  boards.forEach((bd, i) => {
    const numBoard = {
      boardNum: i,
      thisBoard: bd,
      bingo: false,
      lastTile: 0
    }
    numberedBoards.push(numBoard)
  })

  let bingo = false
  let score = 0
  numbers.some(n => {
    numberedBoards.forEach((b, bi) => {
      const board = b.thisBoard
      const foundIndex = board.findIndex(t => t.num === n)
      if (foundIndex !== -1) board[foundIndex].marked = true
      bingo = isBingo(board)
      if (bingo === true) {
        b.bingo = true
        b.lastTile = n
      }
    })

    const iToRemove = []
    numberedBoards.forEach(nm => {
      if (nm.bingo === true) iToRemove.push(nm.boardNum)
    })

    // Get score for last board
    if (numberedBoards.length === 1) {
      const lastBoard = numberedBoards[0]
      const sumUnmarked = lastBoard.thisBoard.reduce((sum, tile) => {
        if (tile.marked === false) {
          return sum + tile.num
        } else {
          return sum
        }
      }, 0)
      score = sumUnmarked * lastBoard.lastTile
    }

    // Remove boards that have gotten a bingo
    iToRemove.forEach(rem => {
      if (numberedBoards.length !== 1) {
        const iToRemove = numberedBoards.findIndex(nb => nb.boardNum === rem)
        numberedBoards.splice(iToRemove, 1)
      }
    })
    return score > 0
  })
  return score
}

async function solveForFirstStar (numbers, boards) {
  const score = playGameTilFirstWin(numbers, boards)

  report('Total Numbers:', numbers.length)
  report('Total Boards:', boards.length)
  report('Solution 1:', score)
}

async function solveForSecondStar (numbers, boards) {
  const score = playGameTilLastWin(numbers, boards)

  report('Solution 2:', score)
}

run()
