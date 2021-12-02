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
  let h = 0
  let d = 0
  const line = input.split('\n').map(n => n)
  line.forEach(l => {
    const line = l.split(' ')
    const num = Number.parseInt(line[1])
    if (line[0] === 'forward') {
      d += num
    } else if (line[0] === 'down') {
      h += num
    } else {
      h -= num
    }
  })

  const solution = h * d
  report('Input:', line.length)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  let h = 0
  let d = 0
  let a = 0
  const line = input.split('\n').map(n => n)
  line.forEach(l => {
    const line = l.split(' ')
    const num = Number.parseInt(line[1])
    if (line[0] === 'forward') {
      h += num
      d = d + (a * num)
    } else if (line[0] === 'down') {
      a += num
    } else {
      a -= num
    }
  })

  const solution = h * d
  report('Solution 2:', solution)
}

run()
