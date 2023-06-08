
const canvas = document.getElementById('3d-canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.innerWidth < window.innerHeight ? canvas.height = window.innerWidth : canvas.width = window.innerHeight
const size = canvas.width

const ctx = canvas.getContext('2d')
const three = new sost.Canvas3D(ctx, 1, 1, 1)
three.Camera.angle = [Math.PI / 4, Math.PI / 4]

const refresh = () => {

    // Clear canvas
    three.clear()

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
    three.stroke = false
    three.pointSize = 5
    three.pointStyle = 'white'
    three.point(origin)

    // Polygons
    three.fillStyle = 'rgba(255, 0, 255, 0.25)'
    three.polygon(XY)
    three.fillStyle = 'rgba(255, 255, 0, 0.25)'
    three.polygon(XZ)
    three.fillStyle = 'rgba(0, 255, 255, 0.25)'
    three.polygon(YZ)
    
}; refresh()

let down = false
document.addEventListener('mousedown', () => { down = true })
document.addEventListener('mouseup', () => { 
    
    down = false
    x = undefined
    y = undefined

})

let x, y
const speed = 2
document.addEventListener('mousemove', e => {

    if (down) {
        
        if (x === undefined) x = e.clientX
        if (y === undefined) y = e.clientY

        const dx = e.clientX - x
        const dy = e.clientY - y

        let [theta, phi] = three.Camera.angle
        theta += dx / size * Math.PI * 2 * speed
        phi += dy / size * Math.PI * 2 * speed

        three.Camera.angle = [theta, phi]

        x = e.clientX
        y = e.clientY

        refresh()

    }

})
