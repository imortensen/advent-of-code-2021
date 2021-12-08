const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
  await solveForFirstStar(input.split(',').map(f => Number.parseInt(f)), 80)
  await solveForSecondStar(input.split(',').map(f => Number.parseInt(f)), 256)
}

async function solveForFirstStar (fish, days) {
  const originalFish = fish.length

  for (let i = 0; i < days; i++) {
    fish.forEach((f, fi) => {
      if (f === 0) {
        fish[fi] = 6
        fish.push(8)
      } else if (f > 0) {
        fish[fi] = f - 1
      }
    })
  }

  const solution = fish.length
  report('Input:', originalFish)
  report('Solution 1:', solution)
}

// Got stuck on this one. Had to go to reddit for help.
async function solveForSecondStar (fish, days) {
  const school = {}
  for (let i = 0; i < 9; i++) {
    school[i] = 0
  }

  fish.forEach(f => {
    school[f]++
  })

  for (let i = 0; i < days; i++) {

    const tempZero = school[0]
    for (let z = 0; z < 9; z++) {
      school[z] = school[z + 1]
    }
    school[8] = tempZero
    school[6] += tempZero
  }

  console.log(school)

  const solution = Object.values(school).reduce((accu, curr) => {
    return accu + curr
  })

  report('Days:', days)
  report('Solution 2:', solution)
}

run()
