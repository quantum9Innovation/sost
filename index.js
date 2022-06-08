
const canvas = document.getElementById('3d-canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.innerWidth < window.innerHeight ? canvas.height = window.innerWidth : canvas.width = window.innerHeight
const size = canvas.width

const ctx = canvas.getContext('2d')
const three = new sost.Canvas3D(ctx, size, size, size)
