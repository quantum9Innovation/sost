// Base testing file
// Activate with: `mocha`

// Imports
const fs = require('fs')
const path = require('path')
const sost = require('../sost')
const { createCanvas } = require('canvas')

console.log('Starting tests...')
console.log('All results are stored in artifacts/')

// Canvases
const canvas = createCanvas(256, 256)
const ctx = canvas.getContext('2d')
console.log(canvas)
const three = new sost.Canvas3D(ctx, 2, 2, 2)
three.Camera.angle = [Math.PI / 4, Math.PI / 4]


const draw = () => {

    // Define origin
    const origin = [0, 0, 0]

    // Define axis boundaries
    const X = [[-1, 0, 0], [1, 0, 0]]
    const Y = [[0, -1, 0], [0, 1, 0]]
    const Z = [[0, 0, -1], [0, 0, 1]]

    // Define plane endpoints
    const XY = [[-0.25, -0.25, 0], [-0.25, 0.25, 0], [0.25, 0.25, 0], [0.25, -0.25, 0]]
    const XZ = [[-0.25, 0, -0.25], [-0.25, 0, 0.25], [0.25, 0, 0.25], [0.25, 0, -0.25]]
    const YZ = [[0, -0.25, -0.25], [0, -0.25, 0.25], [0, 0.25, 0.25], [0, 0.25, -0.25]]

    // Axes
    three.strokeStyle = 'red'
    three.line(...X)
    three.strokeStyle = 'blue'
    three.line(...Y)
    three.strokeStyle = 'green'
    three.line(...Z)

    // Points
    three.pointStyle = 'white'
    three.point(origin)

    // Polygons
    three.fillStyle = 'rgba(255, 0, 255, 0.25)'
    three.polygon(XY)
    three.fillStyle = 'rgba(255, 255, 0, 0.25)'
    three.polygon(XZ)
    three.fillStyle = 'rgba(0, 255, 255, 0.25)'
    three.polygon(YZ)

}; draw()


// Storage
const out = fs.createWriteStream(path.join(
    __dirname,
    'artifacts',
    'base.png'
))
const stream = canvas.createPNGStream()
stream.pipe(out)
out.on('finish', () => { console.log('Base test succeeded') })
