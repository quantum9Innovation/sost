// Core logic and functions for Sost
// Most of the code depends on other modules

// Dependencies
const { form } = require('./math')


// Camera
class Camera {
    // Create a new camera linked to a specific canvas
    // Manages perspective, zoom, translation, and other 3D transformations

    constructor(Canvas, theta=0, phi=0) { 
        /*
            Initialize camera, with a perspective defined by `theta` and `phi`
            `theta` is the angle of rotation about the XY plane, and 
            `phi` is the angle of rotation about the YZ plane.
            Both default to zero (viewing angle parallel to XZ plane).
        */

        this.Canvas = Canvas
        this.angle = [theta, phi]
        this.center = [0, 0, 0]
        this.zoom = 1

    }

    rotate(vec) {
        // Rotate a vector `vec` to match standard orientation
        // (theta, phi) = (0, 0), or parallel to the XZ plane

        return form.rotate(vec, -this.angle[0], -this.angle[1])

    }
    translate(vec) {
        // Translate a vector `vec` such that `this.center` is at the origin

        return form.subtract(vec, this.center)

    }
    scale(vec) {
        // Scale a vector `vec` to standard zoom level 
        // (as defined by point space)

        return form.multiply(1 / this.zoom, vec)

    }

    rotate_inv(vec) {
        // Inverse of `rotate`

        return form.rotate(vec, this.angle[0], this.angle[1])

    }
    translate_inv(vec) {
        // Inverse of `translate`

        return form.add(vec, this.center)

    }
    scale_inv(vec) {
        // Inverse of `scale`

        return form.multiply(this.zoom, vec)

    }

}


// Coordinate systems
class PixelSpace {
    /*
        Initialize a 2D coordinate system which corresponds to 
        internal canvas coordinates.
        Because pixel space is a 2D coordinate system, there is no way to 
        translate a point in pixel space to a point in any other 3D coordinate
        system; only the opposite works.
    */

    constructor(Canvas) { this.Canvas = Canvas }
    fromPoint(point) {
        /*
            Express coordinates in a corresponding point space in pixel space.
            Project a point in three dimensions onto the 2D canvas.
            Assumes a viewing angle parallel to the XZ plane.
        */

        // Decompose point into components
        let [x, _y, z] = point

        // Compute new point components
        let xNew = x
        let yNew = z

        // Translate point onto canvas
        xNew += this.Canvas.width / 2
        yNew += this.Canvas.height / 2

        // Scale point to canvas size
        xNew *= this.Canvas.cwidth / this.Canvas.width
        yNew *= this.Canvas.cheight / this.Canvas.height

        // Return new point
        return [xNew, yNew]

    }

}
class PointSpace {
    /*
        The default (base) coordinate system for any 3D canvas instance.
        All points are expressed as a 3D vector with the origin at 
        the center of the canvas and the width, height, and 
        depth corresponding to user-defined canvas dimensions.
        Points in this coordinate system can be converted to 
        any other coordinate system and converted from 
        any Cartesian-based coordinate system.
        To support conversion to pixel space, this space has a fixed perspective
        that is parallel to the XZ plane.
    */

    constructor(Canvas) { this.Canvas = Canvas }
    fromCartesian(point) {
        // Support for perspective-aware Cartesian to point space conversion

        // Rotate point in Cartesian space such that 
        // the viewing angle is parallel to the XZ plane
        let [x, y, z] = this.Canvas.Camera.rotate(point)
        
        // Translate into point space
        [x, y, z] = this.Canvas.Camera.translate([x, y, z])

        // Zoom into point space
        [x, y, z] = this.Canvas.Camera.scale([x, y, z])

        // Return new point
        return [x, y, z]

    }

}
class CartesianSpace {
    /*
        A coordinate system based on 3D Cartesian coordinates, 
        where every point is expressed as an [x, y, z] triple.
        Perspective-aware conversion to point space is supported by default.
    */

    constructor(Canvas) { this.Canvas = Canvas }
    fromPoint(point) {
        // Direct inverse of `PointSpace.fromCartesian`

        // Zoom out of point space
        let [x, y, z] = this.Canvas.Camera.scale_inv(point)

        // Translate into Cartesian space
        [x, y, z] = this.Canvas.Camera.translate_inv([x, y, z])

        // Rotate to perspective
        [x, y, z] = this.Canvas.Camera.rotate_inv([x, y, z])

        // Return new point
        return [x, y, z]

    }

}


// Create the canvas
class Canvas3D {
    // Transform a 2D canvas into a 3D one
    // The standard canvas instance in Sost

    constructor(ctx, w, h, d) {
        /*
            Initialize a 3D canvas with the given context `ctx` and
            dimensions `w` (width-X), `h` (height-Y), and `d` (depth-Z) in
            point space (not pixel or Cartesian space).
            Once set, these properties cannot be changed.
        */

        // Set intrinsic canvas properties
        this.ctx = ctx
        this.cwidth = ctx.canvas.width
        this.cheight = ctx.canvas.height

        // Set internal canvas dimensions
        this.width = w
        this.height = h
        this.depth = d

        // Initialize the canvas for 3D rendering
        this.init()

        // Control variables
        this.pointStyle = 'red'
        this.pointSize = 1
        this.strokeStyle = 'white'
        this.lineWidth = 1
        this.fillStyle = '#4ca9d4'
        this.altFillStyle = '#3f8cb0'
        this.fill = true

    }
    init() {
        // Initialize the canvas for 3D rendering
        // Performs basic setup routines for the canvas

        // Set the canvas to be black
        this.ctx.fillRect(0, 0, this.cwidth, this.cheight)
        
        // Initialize the camera
        this.Camera = new Camera(this)

        // Initialize coordinate systems
        this.Pixel = new PixelSpace(this)
        this.Point = new PointSpace(this)
        this.Cartesian = new CartesianSpace(this)

    }

    // Primitives (point space)
    p_point(vec) {
        // Draw a point in point space

        // Convert point to pixel space
        let [x, y] = this.pixel.fromPoint(vec)

        // Draw point
        this.ctx.beginPath()
        this.ctx.arc(x, y, this.pointSize, 0, 2 * Math.PI)
        this.ctx.fillStyle = this.pointStyle
        this.ctx.fill()

    }

    // Low-level abstractions (Cartesian space)
    point(vec) {
        // Draw a point in Cartesian space

        // Convert point to point space
        let p_vec = this.point.fromCartesian(vec)

        // Draw point
        this.p_point(p_vec)

    }
    
}


// Initialize Sost and export relevant functions
module.exports = {

    // Base
    Canvas3D,

    // Camera
    Camera,

    // Coordinate systems
    PixelSpace,
    PointSpace,
    CartesianSpace,

}
