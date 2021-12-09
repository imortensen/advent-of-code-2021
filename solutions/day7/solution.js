const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
    .split(',').map(p => Number.parseInt(p))

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

async function solveForFirstStar (positions) {
  const length = positions.length
  positions.sort((a, b) => a - b)
  const max = Math.max(...positions)
  const options = {}

  for (let i = 0; i <= max; i++) {
    options[i] = 0
  }

  Object.keys(options).forEach(o => {
    let sum = 0
    positions.forEach(p => {
      sum = sum + Math.abs(p - o)
    })
    options[o] = sum
  })

  const solution = Math.min(...Object.values(options))

  report('Input:', length)
  report('Solution 1:', solution)
}

async function solveForSecondStar (positions) {
  positions.sort((a, b) => a - b)
  const max = Math.max(...positions)
  const options = {}

  for (let i = 0; i <= max; i++) {
    options[i] = 0
  }

  Object.keys(options).forEach(o => {
    let sum = 0
    positions.forEach(p => {
      const dif = Math.abs(p - o)

      let sumDif = 0
      for (let i = 1; i < dif + 1; i++) {
        sumDif = sumDif + i
      }

      sum = sum + sumDif
    })
    options[o] = sum
  })

  const solution = Math.min(...Object.values(options))

  report('Solution 2:', solution)
}

run()
