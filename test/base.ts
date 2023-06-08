// Base testing file

// Types
import { vec3d } from '../sost/primitives'

// Imports
import * as fs from 'fs'
import * as path from 'path'
import * as sost from '../sost'
import { createCanvas } from 'canvas'

console.log('Starting tests …')
console.log('All results are stored in `artifacts/`')

// Canvases
const canvas = createCanvas(256, 256)
const ctx = canvas.getContext('2d')
const three = new sost.Canvas3D(ctx, 2, 2, 2)
three.Camera.angle = [Math.PI / 4, Math.PI / 4]

const draw = () => {
  // Define origin
  const origin: vec3d = [0, 0, 0]

  // Define axis boundaries
  const X: vec3d[] = [[-1, 0, 0], [1, 0, 0]]
  const Y: vec3d[] = [[0, -1, 0], [0, 1, 0]]
  const Z: vec3d[] = [[0, 0, -1], [0, 0, 1]]

  // Define plane endpoints
  const XY: vec3d[] = [[-0.25, -0.25, 0], [-0.25, 0.25, 0], [0.25, 0.25, 0], [0.25, -0.25, 0]]
  const XZ: vec3d[] = [[-0.25, 0, -0.25], [-0.25, 0, 0.25], [0.25, 0, 0.25], [0.25, 0, -0.25]]
  const YZ: vec3d[] = [[0, -0.25, -0.25], [0, -0.25, 0.25], [0, 0.25, 0.25], [0, 0.25, -0.25]]

  // Axes
  three.strokeStyle = 'red'
  three.line(X[0], X[1])
  three.strokeStyle = 'blue'
  three.line(Y[0], Y[1])
  three.strokeStyle = 'green'
  three.line(Z[0], Z[1])

  // Points
  three.stroke = false
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
const out = fs.createWriteStream(path.join('artifacts', 'base.png'))
const stream = canvas.createPNGStream()
stream.pipe(out)
out.on('finish', () => { console.log('Base test succeeded!') })
