// A series of functions for working with 3D geometry through various 
// transformations; these functions are critical for the initial rendering 
// process

// Rotations (3D→3D)
const rotateXZ = (vec, theta) => {
    // Rotate a vector `vec` about the XZ plane by `theta` radians

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
const rotateYZ = (vec, theta) => {
    // Rotate a vector `vec` about the YZ plane by `theta` radians

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
const rotateXY = (vec, theta) => {
    // Rotate a vector `vec` about the XY plane by `theta` radians

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


// Rotations (3D→2D)
const rotate = (vec, theta, phi) => {
    // Rotate a vector `vec` about the XY plane by `theta` radians and 
    // about the YZ plane by `phi` radians

    // Rotate
    let nVec = rotateXY(vec, theta)
    nVec = rotateYZ(nVec, phi)

    // Return new vector
    return nVec

}


// 3D vector arithmetic
const add = (u, v) => {
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
const subtract = (u, v) => {
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
const multiply = (k, u) => {
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


module.exports = {

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
