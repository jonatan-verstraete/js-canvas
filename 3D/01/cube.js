const points = []
const triangles = []
const W = 800,
    H = 800,
    MODminX = -2,
    MODminY = -2,
    MODmaxX = 2,
    MODmaxY = 2,
    CAM_DIS = 3

let posX = 0,
    posY = 0,
    theta = 0,
    dtheta = 0.01,
    rotateSpeedX = 0.3,
    rotateSpeedY = 1

;
ctx.background('#111')

function initGeometry() {
    for (let x = -1; x <= 1; x += 2) {
        for (let y = -1; y <= 1; y += 2) {
            for (let z = -1; z <= 1; z += 2) {
                points.push(new Vector(x, y, z))
            }
        }
    }
    for (let dimension = 0; dimension <= 2; ++dimension) {
        for (let side = -1; side <= 1; side += 2) {
            const sidePoints = points.filter(p => {
                return p[['x', 'y', 'z'][dimension]] == side
            })
            let [a, b, c, d] = sidePoints
            makeTriangle(a, b, c)
            makeTriangle(d, b, c)
        }
    }
}

function makeTriangle(a, b, c) {
    triangles.push([a, b, c])
}


function renderTriangle(t) {
    const pt = t.map(i=>project(i))
    let [a, b, c] = pt
    // log(pt)
    // exitting()
    ctx.strokeStyle="green"
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.lineTo(c.x, c.y)
    ctx.closePath()

    ctx.stroke()
    ctx.fill()

}

function projectPerspective(t) {
    const {x, y, z} = t
    return {
        x:x / (z + CAM_DIS),
        y:y / (z + CAM_DIS),
        z:z
    }
}



function project(t) {
    const perspective = projectPerspective(t)
    let {x, y, z} = perspective

    return {
        x:W * (x - MODminX) / (MODmaxX - MODminX),
        y:H * (1 - (y - MODminY) / (MODmaxY - MODminY)),
        z:z
    }
}



async function render() {
    clear()

    theta += dtheta
    triangles.forEach(async (t, idx) => {
        const rott = t.map(p=>{
            p.rotateY(theta * rotateSpeedY)
            // p.rotateX(theta * rotateSpeedX)
            return p
        })
        ctx.fillStyle = `hsla(${idx * (360 / triangles.length) },${60}%,50%,${1})`;

        renderTriangle(rott)
    })
   // await sleep(1)
    await pauseHalt()

    requestAnimationFrame(render)
}




initGeometry()
render()


