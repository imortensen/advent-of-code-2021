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
  const line = input.split('\n').map(n => n.split('').map(n => Number.parseInt(n)))
  const lines = line.length
  const columns = []

  // Inititalize columns
  line[0].forEach(l => {
    columns.push(0)
  })

  // Sum each column and add to array
  line.forEach(l => {
    // For each digit in the line add to column total
    l.forEach((d, i) => {
      columns[i] += d
    })
  })

  let gamma = ''
  let epsilon = ''

  columns.forEach(x => {
    if (x / lines > 0.5) {
      gamma = gamma + 1
      epsilon = epsilon + 0
    } else {
      gamma = gamma + 0
      epsilon = epsilon + 1
    }
  })

  const gNumber = parseInt(gamma, 2)
  const eNumber = parseInt(epsilon, 2)

  const solution = gNumber * eNumber
  report('Input:', lines)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const line = input.split('\n').map(n => n.split('').map(n => Number.parseInt(n)))
  const lines = line.length
  const columns = []

  // Inititalize columns
  line[0].forEach(l => {
    columns.push(0)
  })

  // Sum each column and add to array
  line.forEach(l => {
    // For each digit in the line add to column total
    l.forEach((d, i) => {
      columns[i] += d
    })
  })

  const gamma = []
  const epsilon = []

  // First filter
  columns.forEach(c => {
    if (c / lines >= 0.5) {
      gamma.push(1)
      epsilon.push(0)
    } else {
      gamma.push(0)
      epsilon.push(1)
    }
  })

  const filterLoop = (array, newGamma, newLine, oRating) => {
    array.every((z, i) => {
      const filtered = []

      if (newGamma === 1) {
        let count = 0
        newLine.forEach(l => {
          if (l[i] === 1) {
            filtered.push(0)
            filtered[count] = l
            count++
          }
        })
      }

      if (newGamma === 0) {
        let count = 0
        newLine.forEach(l => {
          if (l[i] === 0) {
            filtered.push(0)
            filtered[count] = l
            count++
          }
        })
      }

      newLine = [...filtered]

      if (newLine.length === 1) {
        // Exit loop if down to last line
        return false
      } else {
        let newCount = 0
        newLine.forEach(l => {
          newCount += l[i + 1]
        })
        // Keep the bit with more for Oxygen Rating, Less for
        if (newCount / newLine.length >= 0.5) {
          oRating ? newGamma = 1 : newGamma = 0
        } else {
          oRating ? newGamma = 0 : newGamma = 1
        }
        return true
      }
    })

    return parseInt(newLine[0].join(''), 2)
  }

  const gammaLine = [...line]
  const epLine = [...line]

  const OxygenRating = filterLoop(gamma, gamma[0], gammaLine, 1)
  const CO2Rating = filterLoop(epsilon, epsilon[0], epLine)

  const solution = OxygenRating * CO2Rating
  report('Solution 2:', solution)
}

run()
