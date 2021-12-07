const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
    .split('\n')
    .map(line => {
      return line.split(' -> ')
        .map(coord => coord.split(','))
    })

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

const goUporDown = (a, b, c1x, coordinates) => {
  for (let i = b.y + 1; i < a.y; i++) {
    const connCoord = {
      x: c1x,
      y: i
    }
    coordinates.push(connCoord)
  }
}

const goLeftorRight = (a, b, c1y, coordinates) => {
  for (let i = b.x + 1; i < a.x; i++) {
    const connCoord = {
      x: i,
      y: c1y
    }
    coordinates.push(connCoord)
  }
}

const vertical = (coord1, coord2, coordinates) => {
  const yDif = coord1.y - coord2.y
  if (yDif > 1) {
    goUporDown(coord1, coord2, coord1.x, coordinates)
  } else if (yDif < 1) {
    goUporDown(coord2, coord1, coord1.x, coordinates)
  }
}

const horizontal = (coord1, coord2, coordinates) => {
  const xDif = coord1.x - coord2.x
  if (xDif > 1) {
    goLeftorRight(coord1, coord2, coord1.y, coordinates)
  } else if (xDif < 1) {
    goLeftorRight(coord2, coord1, coord1.y, coordinates)
  }
}

const diagonal = (coord1, dif, coordinates, adj) => {
  for (let i = 1; i < dif; i++) {
    const connCoord = {
      x: coord1.x + adj[0] * i,
      y: coord1.y + adj[1] * i
    }
    coordinates.push(connCoord)
  }
}

async function solveForFirstStar (input) {
  const coordinates = []
  input.forEach(line => {
    const coord1 = {
      x: Number.parseInt(line[0][0]),
      y: Number.parseInt(line[0][1])
    }
    const coord2 = {
      x: Number.parseInt(line[1][0]),
      y: Number.parseInt(line[1][1])
    }

    const xSame = coord1.x === coord2.x
    const ySame = coord1.y === coord2.y

    if (xSame || ySame) {
      coordinates.push(coord1, coord2)

      if (xSame) vertical(coord1, coord2, coordinates)
      if (ySame) horizontal(coord1, coord2, coordinates)
    }
  })

  const result = { }

  for (let i = 0; i < coordinates.length; i++) {
    result[JSON.stringify(coordinates[i])] = (result[JSON.stringify(coordinates[i])] || 0) + 1
  }

  let counts = 0
  Object.keys(result).forEach(c => {
    if (result[c] > 1) counts++
  })

  report('Input:', input.length)
  report('Coordinates:', coordinates.length)
  report('Solution 1:', counts)
}

async function solveForSecondStar (input) {
  const coordinates = []
  input.forEach(line => {
    const coord1 = {
      x: Number.parseInt(line[0][0]),
      y: Number.parseInt(line[0][1])
    }
    const coord2 = {
      x: Number.parseInt(line[1][0]),
      y: Number.parseInt(line[1][1])
    }

    const xSame = coord1.x === coord2.x
    const ySame = coord1.y === coord2.y
    const upLeft = coord1.x > coord2.x && coord1.y > coord2.y
    const downRight = coord1.x < coord2.x && coord1.y < coord2.y
    const upRight = coord1.x < coord2.x && coord1.y > coord2.y
    const downLeft = coord1.x > coord2.x && coord1.y < coord2.y

    coordinates.push(coord1, coord2)

    if (xSame) vertical(coord1, coord2, coordinates)
    if (ySame) horizontal(coord1, coord2, coordinates)

    const dif = Math.abs(coord1.x - coord2.x)

    if (upLeft) diagonal(coord1, dif, coordinates, [-1, -1])
    if (downRight) diagonal(coord1, dif, coordinates, [1, 1])
    if (upRight) diagonal(coord1, dif, coordinates, [1, -1])
    if (downLeft) diagonal(coord1, dif, coordinates, [-1, 1])
  })

  const result = { }

  for (let i = 0; i < coordinates.length; i++) {
    result[JSON.stringify(coordinates[i])] = (result[JSON.stringify(coordinates[i])] || 0) + 1
  }

  let counts = 0
  Object.keys(result).forEach(c => {
    if (result[c] > 1) counts++
  })

  report('Solution 2:', counts)
}

run()
