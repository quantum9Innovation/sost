// A series of functions for working with 3D geometry through various 
// transformations; these functions are critical for the initial rendering 
// process

// Types
import { vec3d, ang, ang3d } from '../primitives'

// Rotations (3D → 3D)
const rotateXZ = (vec: vec3d, theta: ang): vec3d => {
  // Rotate a vector `vec` over the XZ plane by `theta` radians

  // Decompose vector into components
  let [x, y, z] = vec

  // Compute trigonometric values
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)

  // Compute new vector components
  const xNew = x * cosTheta - z * sinTheta
  const zNew = x * sinTheta + z * cosTheta

  // Return new vector
  return [xNew, y, zNew]
}
const rotateYZ = (vec: vec3d, theta: ang): vec3d => {
  // Rotate a vector `vec` over the YZ plane by `theta` radians

  // Decompose vector into components
  let [x, y, z] = vec

  // Compute trigonometric values
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)

  // Compute new vector components
  const yNew = y * cosTheta - z * sinTheta
  const zNew = y * sinTheta + z * cosTheta

  // Return new vector
  return [x, yNew, zNew]
}
const rotateXY = (vec: vec3d, theta: ang): vec3d => {
  // Rotate a vector `vec` over the XY plane by `theta` radians

  // Decompose vector into components
  let [x, y, z] = vec

  // Compute trigonometric values
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)

  // Compute new vector components
  const xNew = x * cosTheta - y * sinTheta
  const yNew = x * sinTheta + y * cosTheta

  // Return new vector
  return [xNew, yNew, z]
}

// Rotations (3D → 2D)
const rotate = (vec: vec3d, angle: ang3d) => {
  // Rotate a vector `vec` by 3D angle `angle`,
  // where the first component specifies rotation over the XY plane,
  // and the second component specifies rotation over the YZ plane

  // Get angle components
  const [theta, phi] = angle

  // Rotate
  let nVec = rotateXY(vec, theta)
  nVec = rotateYZ(nVec, phi)

  // Return new vector
  return nVec
}

// 3D vector arithmetic
const add = (u: vec3d, v: vec3d): vec3d => {
  // Add two vectors `u` and `v`

  // Decompose vectors into components
  let [u_x, u_y, u_z] = u
  let [v_x, v_y, v_z] = v

  // Compute new vector components
  const x = u_x + v_x
  const y = u_y + v_y
  const z = u_z + v_z

  // Return new vector
  return [x, y, z]
}
const subtract = (u: vec3d, v: vec3d): vec3d => {
  // Subtract vector `v` from vector `u`

  // Decompose vectors into components
  let [u_x, u_y, u_z] = u
  let [v_x, v_y, v_z] = v

  // Compute new vector components
  const x = u_x - v_x
  const y = u_y - v_y
  const z = u_z - v_z

  // Return new vector
  return [x, y, z]
}
const multiply = (k: number, u: vec3d): vec3d => {
  // Multiply vector `u` by scalar `k`

  // Decompose vector into components
  let [u_x, u_y, u_z] = u

  // Compute new vector components
  const x = k * u_x
  const y = k * u_y
  const z = k * u_z

  // Return new vector
  return [x, y, z]
}

// Exports
export {
  // 3D→3D rotations
  rotateXZ,
  rotateYZ,
  rotateXY,

  // 3D→2D rotations
  rotate,

  // 3D vector arithmetic
  add,
  subtract,
  multiply,
}
