// A series of functions for working with 3D geometry through various 
// transformations; these functions are critical for the initial rendering 
// process

// Rotations (3D→2D)
// Base rotation function
const rotateXZ_YZ = (vec, theta, phi) => {
    // Rotate a vector `vec` about the origin over the XZ plane by `theta`
    // radians and then over the YZ plane by `phi` radians

    // Decompose vector into components
    ({x, y, z} = vec)

    // Compute trigonometric values
    const cosTheta = Math.cos(theta)
    const sinTheta = Math.sin(theta)
    const cosPhi = Math.cos(phi)
    const sinPhi = Math.sin(phi)

    // Compute new vector components
    const xNew = x * cosTheta - y * sinTheta - z * sinTheta
    const zNew = x * sinTheta * sinPhi + y * cosTheta * sinPhi 
               + z * cosTheta * cosPhi

    // Return new vector
    return { x: xNew, y: zNew }

}


export { rotateXZ_YZ }
