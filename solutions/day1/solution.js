const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

async function solveForFirstStar (input) {
  const numbers = input.split('\n').map(n => Number.parseInt(n))
  let count = 0

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > numbers[i - 1]) count++
  }

  const solution = count
  report('Input:', numbers.length)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const numbers = input.split('\n').map(n => Number.parseInt(n))
  let count = 0

  for (let i = 1; i < numbers.length - 2; i++) {
    if (numbers[i] + numbers[i + 1] + numbers[i + 2] > numbers[i - 1] + numbers[i] + numbers[i + 1]) count++
  }
  const solution = count
  report('Solution 2:', solution)
}

run()
