const light={
    x: 0,
    y: 0,
    s: 10,
    watt: 1,
    draw() {
        this.x = mouseX-80
        this.y = mouseY
        circle(this.x, this.y, this.s*this.watt, null, "orange")
    }
}



const shape0 = getquarePoints(600, 400, 50)
const shape1 = [
    {x:25, y:25},
    {x:105, y:25},
    {x:25, y:105},
    {x:125, y:125},
    {x:125, y:45},
    {x:45, y:125}
]

const shapes =[new Shape(shape0),]// new Shape(shape1)
pause=true

function shadeShape(points) {
    /* 
        TODO: 
        -should be the further the light, the smaller the shadow. comment 2: OK, but too small
        -https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient

    */

    // draw shade
    const pts = copy(points)
    pts.forEach(i=> { 
        //i.d = distanceTo(i, light, true)
        i.d = (50000/distanceTo(i, light, true))
        i.pst = posTowards(i, light, i.d*-1) 
        i.sort = i.d/100//(abs(i.pst.a) * abs(i.d))/100
    })

    pts.forEach((i,idx)=> {
        font(15, "green")
        markPoint(i.x+200, i.y, 20, {txt: sCoord(idx, toFixed(i.sort, 1)), stroke:"green"})
    })

    pts.sortAc('sort')
    pts.splice(pts.length-3, 0, pts.shift())
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)

    pts.slice(0, pts.length-1).forEach(i=> {
        //ctx.lineTo(i.x, i.y
        ctx.lineTo(i.x+i.pst.x, i.y+i.pst.y)
    })
    ctx.lineTo(pts[2].x, pts[2].y)

    ctx.fillStyle="#3339"
    ctx.closePath()
    ctx.fill()

    pts.slice(0, pts.length-1).forEach((i, idx)=> {
        //ctx.lineTo(i.x, i.y
        markPoint(i.x+i.pst.x, i.y+i.pst.y, 10, {txt: sCoord(idx, toFixed(i.sort, 1))})
    })

    pts.forEach((i,idx)=> {
        font(15, "red")
        markPoint(i.x, i.y, 20, {txt: sCoord(idx, toFixed(i.sort, 1)) })
    })

    // draw original shape
    // ctx.fillStyle="white"
    // ctx.beginPath()
    // ctx.moveTo(points[0].x, points[0].y)
    // points.forEach(i=> ctx.lineTo(i.x, i.y) )
    // ctx.closePath()
    // ctx.fill()
}



async function draw() {
    ctx.background("#222")
    clear()
    light.draw()
    shapes.forEach(i=>{
        i.move()
        shadeShape(i.points)
    })
    //await pauseHalt(null, false)

    requestAnimationFrame(draw)
}

draw()