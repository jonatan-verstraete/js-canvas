let mouseX=0, mouseY=0;
const light={
    x: Xmid,
    y: Ymid,
    s: 50,
    watt: 0.3,
    draw() {
        this.x = mouseX
        this.y = mouseY
        circle(this.x, this.y, this.s*this.watt, null, "orange")
    }
}

function getquarePoints(x, y, s) {
    const p1 = {x:x  , y:y  }
    const p2 = {x:x+s, y:y  }
    const p3 = {x:x+s, y:y+s}
    const p4 = {x:x  , y:y+s}
    return [p1, p2, p3, p4]
}


function shadeShape(points) {
    /* 
        TODO: 
        -should be the further the light, the smaller the shadow. comment 2: OK, but too small
        -https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient

    */

    /* Light distance: */
    // sqrt(Xmax ** 2 + Ymax ** 2)*light.watt * -1
    // (500/distanceTo(m, light, true))*-1*distanceTo(m, light, true)
    // (distanceTo(m, light, true))*-1

    // draw original shape
    ctx.fillStyle="white"
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    points.forEach(i=> {
        ctx.lineTo(i.x, i.y)
    })
    ctx.closePath()
    ctx.fill()


    // sorting the points ond istance to light and getting their next position
    const pts = JSON.parse(JSON.stringify(points))

    pts.forEach(i=> { 
        i.dis = distanceTo(i, light, true)
        i.pst = posTowards(i, light, i.dis*-1) 
    })
    pts.sort((a, b)=>b.dis - a.dis)

    ctx.fillStyle="#1118"
    const {0:a,1:b,2:c,3:d} = pts

    ctx.beginPath()
    // furthest to 'b' corner
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    // move to new  corners
    ctx.lineTo(b.x+b.pst.x, b.y+b.pst.y)
    ctx.lineTo(a.x+a.pst.x, a.y+a.pst.y)
    ctx.lineTo(c.x+c.pst.x, c.y+c.pst.y)
    // back to shape
    ctx.lineTo(c.x, c.y)
    ctx.closePath()
    ctx.fill()
}


const shape0 = getquarePoints(600, 400, 50)

log(shape0)

async function draw() {
    ctx.background("#222")
    clear()
    light.draw()
    shadeShape(shape1)
    await pauseHalt(null, false)

    requestAnimationFrame(draw)
}

draw()

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX
    mouseY = event.clientY
});

draw()