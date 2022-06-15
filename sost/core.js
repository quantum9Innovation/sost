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

        // Translate point onto canvas
        x += this.Canvas.width / 2
        z += this.Canvas.height / 2

        // Scale point to canvas size
        x *= this.Canvas.cwidth / this.Canvas.width
        z *= this.Canvas.cheight / this.Canvas.height

        // Flip from bottom-left to top-left origin
        z = this.Canvas.cheight - z

        // Return new point
        return [x, z]

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
        let nPoint = this.Canvas.Camera.rotate(point)
        
        // Translate into point space
        nPoint = this.Canvas.Camera.translate(nPoint)

        // Zoom into point space
        nPoint = this.Canvas.Camera.scale(nPoint)

        // Return new point
        return nPoint

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
        let nPoint = this.Canvas.Camera.scale_inv(point)

        // Translate into Cartesian space
        nPoint = this.Canvas.Camera.translate_inv(nPoint)

        // Rotate to perspective
        nPoint = this.Canvas.Camera.rotate_inv(nPoint)

        // Return new point
        return nPoint

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
        this.pointSize = 2.5
        this.strokeStyle = 'white'
        this.lineWidth = 2.5
        this.fillStyle = '#4ca9d4'
        this.altFillStyle = '#3f8cb0'
        this.stroke = true
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

    // Controls
    clear() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.cwidth, this.cheight)
    }

    // Primitives (point space)
    p_point(vec) {
        // Draw a point in point space

        // Convert point to pixel space
        let [x, y] = this.Pixel.fromPoint(vec)

        // Draw point
        this.ctx.beginPath()
        this.ctx.arc(x, y, this.pointSize, 0, 2 * Math.PI)
        this.ctx.fillStyle = this.pointStyle
        this.ctx.fill()

    }
    p_line(u, v) {
        // Draw a line in point space

        // Convert points to pixel space
        let [x1, y1] = this.Pixel.fromPoint(u)
        let [x2, y2] = this.Pixel.fromPoint(v)

        // Draw line
        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.strokeStyle = this.strokeStyle
        this.ctx.lineWidth = this.lineWidth
        this.ctx.stroke()
    }
    p_polygon(points) {
        // Draw a polygon in point space

        // Convert points to pixel space
        let nPoints = []
        for (let point of points) {
            nPoints.push(this.Pixel.fromPoint(point))
        }

        // Draw polygon
        this.ctx.beginPath()
        this.ctx.moveTo(nPoints[0][0], nPoints[0][1])
        for (let i = 1; i < nPoints.length; i++) {
            this.ctx.lineTo(nPoints[i][0], nPoints[i][1])
        }
        this.ctx.closePath()

        // Render polygon
        if (this.fill) {
            this.ctx.fillStyle = this.fillStyle
            this.ctx.fill()
        } 
        if (this.stroke) {
            this.ctx.strokeStyle = this.strokeStyle
            this.ctx.lineWidth = this.lineWidth
            this.ctx.stroke()
        }

    }

    // Low-level abstractions (Cartesian space)
    point(vec) {
        // Draw a point in Cartesian space

        // Convert point to point space
        let p_vec = this.Point.fromCartesian(vec)

        // Draw point
        this.p_point(p_vec)

    }
    line(u, v) {
        // Draw a line in Cartesian space

        // Convert points to point space
        let p_u = this.Point.fromCartesian(u)
        let p_v = this.Point.fromCartesian(v)

        // Draw line
        this.p_line(p_u, p_v)
    }
    polygon(points) {
        // Draw a polygon in Cartesian space

        // Convert points to point space
        let p_points = []
        for (let point of points) {
            p_points.push(this.Point.fromCartesian(point))
        }

        // Draw polygon
        this.p_polygon(p_points)

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
