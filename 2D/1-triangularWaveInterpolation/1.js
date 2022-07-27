let lastX = 0
let lastY = 0


function drawInterpolation(xA, yA, CA = "blue", xB = lastX, yB = lastY, CB = lastC, remA = true) {
    const x1a = xA
    const y1a = Mid 
    const x2a = xA
    const y2a = Mid - yA

    const x1b = xB
    const y1b = Mid
    const x2b = xB
    const y2b = Mid - yB

    const mx1 = (xA + xB) / 2
    const my1 = Mid 
    const mx2 = (xA + xB) / 2
    const my2 = Mid - (yA + yB) / 2

    ctx.lineWidth = 1

    line(mx1, my1, mx2, my2, "orange")
    drawCross(x1a, y2a, x1b, y2b, mx1, my2)

    ctx.lineWidth = 5
    line(x1a, y1a, x2a, y2a, CA)

    if(xB != lastX) {
        line(x1b, y1b, x2b, y2b, CB)
    }
    if(remA) {
        lastX = xA
        lastY = yA
        lastC = CA
    } else {
        lastX = xB
        lastY = yB
        lastC = CB
    }
}




async function drawInterpolationGradient({srcX = 10, srcY = 0, maxY = 100, minY = -100, invY = 20, invX = 20, maxX = 2000}) {
    drawInterpolation(srcX, srcY, "red", srcX + invX, srcY, "red", false)
    let cy = srcY
    let yAdder = 1

    for(let i = 1; i < maxX / invX; i ++) {
        cy += (invY * yAdder)

        if(cy < minY || cy > maxY) {
            yAdder *= -1
        }
        drawInterpolation(srcX + invX * i, cy, "red")
    }
}

async function ocsilator() {

    let cy = 1
    let yAdder = 1
    for(let i = 0; i < 400; i++){
        cy = cy + (1 * yAdder)

        if(cy + 50 <= -199 || cy + 50 >= 199) {
            yAdder *= -1
        }
        clear(true)
        drawInterpolationGradient({srcY: cy, srcX: 0})
        await sleep(0.001)
    }
}

async function test() {
    const intrv = 10
    const limit = 300

    let cy = 1
    let yAdder = 1
    for(let i = 0; i < limit; i+= 1) {
        await pauseHalt()
        cy += (intrv * yAdder)

        if(cy <= -limit + intrv || cy >= 90 - intrv) {
            yAdder *= -1
        }
        clear(true)
        drawInterpolationGradient({srcY: cy, maxY: limit, minY: -limit})
        await sleep(0.01)
        await pauseHalt()
    }
    test()
}

test()