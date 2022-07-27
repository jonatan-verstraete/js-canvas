const viewSetup = new Object({
    color: false,
    colorByCharge: false,
    colorMode: ["none", "setById", "setByCharge", "setByDepth"][3],
    mode: ["points", "shadedPoints", "lines", "shapes", "id"][0],
    depth: 600,
    minDepth: 0,
    viewCenter: {
        x: Xmid,
        y: Ymid
    },
    lightSource: {
        x: 0,
        y: 0,
        z: 0,
        strength: 100,
    }
})

const centerSetup = Object.freeze({
    radius: 180,
    force: 1,
    attractionDistance: 120,
    detail: 20,
    show: true,
    singlePoint: true,
    ptSize: 5,
    z: 100,
})

const pointsSetup = Object.freeze({
    maxSize: 15,
    minSize: 3,
    amount: 120,
    speed: 1,
    attractionForce: 0,
    afterIamgeCount: 0,
    afterImageSize: 1,
    connectionDistance: 140,
    margaticMode: false,
    lifespan: 100,
    maxClusterSize: 5,
    clusterReach: 10,
})




// point class
class Point {
    constructor(id, speed = pointsSetup.speed) {
        this.id = id

        this.alpha = 1
        this.theta = randfloat(0, PI2, 5)
        this.phi = randfloat(0, PI, 5)

        this.projScale = 0
        this.projX = 0
        this.projY = 0

        this.x = randint(-viewSetup.viewCenter.x, viewSetup.viewCenter.x * 2)
        this.y = randint(-viewSetup.viewCenter.y, viewSetup.viewCenter.y * 2)
        this.z = 0 //randint(viewSetup.depth-50, viewSetup.depth)

        this.size = 0
        this.speed = {
            x: randfloat(-speed, speed) || 0.1,
            y: randfloat(-speed, speed) || 0.1,
            z: randfloat(-speed, speed) || 0.1,
        }
        this.connections = 0
        this.originalSpeed = Object.copy(this.speed)
        this.lifeTime = 0;
        this.afterImage = []
        this.charge = id % 2 === 0 ? -1 : 1

        this.color = 360/pointsSetup.amount * id
    }

    pos(projected = true) {
        if (projected) return {
            x: this.projX,
            y: this.projY
        }
        return {
            x: this.x,
            y: this.y
        }
    }

    project() {
        this.projScale = viewSetup.depth / (viewSetup.depth + this.z)
        this.projX = (this.x * this.projScale) + viewSetup.viewCenter.x
        this.projY = (this.y * this.projScale) + viewSetup.viewCenter.y

        this.size = mapNums(this.z, 0, viewSetup.depth, pointsSetup.maxSize, pointsSetup.minSize)
        this.alpha = mapNums(this.z, 0, viewSetup.depth, 1, 0)
    }

    move() {
        this.project()
        if (pointsSetup.afterIamgeCount && (viewSetup.mode === "points" || viewSetup.mode === "shadedPoints")) this.addAfterImage(Object.copy(this))

        this.x += this.speed.x
        this.y += this.speed.y
        this.z += this.speed.z

        const m = 10
        if (this.x >= Xmid - m || this.x <= -Xmid + m) this.resetSpeed('x')
        if (this.y >= Ymid - m || this.y <= -Ymid + m) this.resetSpeed('y')
        if (this.z >= Zmax - m || this.z <= -Zmax + m) this.resetSpeed('z')

    }

    addAfterImage(n) {
        this.afterImage.push(n)
        if (this.afterImage.length > pointsSetup.afterIamgeCount) this.afterImage.shift()
    }

    resetSpeed(sign) {
        this.speed[sign] = posInt(this.originalSpeed[sign]) * (isNeg(this.speed[sign]) ? 1 : -1)
        this[sign] += isNeg(this.speed[sign]) ? -10 : 10
        this.lifeTime += 1
    }

    die(points) {
        return
        const clone = new Point(this.id)
        clone.z = Zmax + 100
        points.splice(this.id, 1, clone)
    }

    changeCharge() {
        this.charge *= -1
    }

    getColor() {
        let cl = "#111"
        switch (viewSetup.colorMode) {
            case "none":
                cl =  hsl(0, 0, 100 - 100 * posInt(this.alpha))
                break;
            case "setById":
                cl = hsl((360/pointsSetup.amount) * this.id, 100 * posInt(this.alpha))
                break;
            case "setByCharge":
                cl = this.color = (this.id % 2 === 0 ? 0: 150)
            case "setByDepth":
                cl = hsl(100 * posInt(this.alpha))
                break;
            default:
                cl =  hsl(0, 0, 100 - 100 * posInt(this.alpha))
                break;
        }
        return cl
    }
}



// points class
class Points {
    constructor(amount) {
        this.points = [...new Array(amount)].map((i, idx) => new Point(idx))
        this.colorScale = 360
    }
    showMovement() {
        this.points = this.points.sortAc('alpha')
        if (!this.flag1) {
            viewSetup.depth = 140;
            this.flag1 = true
        }

        function closeToPoint(a, b, r) {
            const disX = inRange(a.projX, b.projX, r, true)
            const disY = inRange(a.projY, b.projY, r, true)
            const disZ = inRange(a.z, b.z, r, true)
            if (disX && disY && disZ) return {
                x: disX,
                y: disY,
                z: disZ,
            }
            return false
        }
        function closeToCenter(p, r) {
            const res = []
            for (let i of circlePoints) {
                const disX = inRange(p.x, i.x, r, true)
                const disY = inRange(p.y, i.y, r, true)
                const disZ = inRange(p.z, i.z, r / 2, true)


                if (disX && disY && disZ) {
                    res.push({
                        d: Math.sqrt(disX ** 2 + disY ** 2 + disZ ** 2),
                        dx: disX,
                        dy: disY,
                        dz: disZ,
                        dif: posInt(posInt(disX) - posInt(disY)),
                        p: i.i,
                        i: i,
                    })
                }
            }
            return res.length > 0 ? res.sortAc('d').slice(0, 3).sortAc('dif')[0] : false
        }

        if (centerSetup.show) circlePoints.forEach((i, idx) => {
            point(i.projX, i.projY, centerSetup.ptSize * 2, 'red');
            ctx.fillText(i.i, i.projX, i.projY)
        })


        this.points.forEach((i, idx, arr) => {
            let conn = []
            let connCount = 0
            let skipLoop = false;
            let clusterSize = 0;
            const thisColor = i.getColor()
 
            i.move()

            // const cp = closeToCenter(i, centerSetup.attractionDistance)
            // if (cp) {
            //     // move towards center
            //     const change = posTowards(i, cp.i, (centerSetup.force * (100 - cp.d / 2) / 100))
            //     arr[idx].speed.x += change.x
            //     arr[idx].speed.y += change.y
            //     arr[idx].speed.z += change.z

            //     conn.push(cp.i)
            //     arr[idx].lifeTime = 0

            // } else if (i.lifeTime > pointsSetup.lifespan) {
            //     i.die(this.points)
            // }


            // view: points
            if (viewSetup.mode === "points") {
                point(i.projX, i.projY, i.size, thisColor)

                if (pointsSetup.afterIamgeCount) {
                    i.afterImage.forEach((a, idx, arr) => point(a.projX, a.projY, (i.size / arr.length) * idx, a.getColor())); //a.size/((idx||1)+1)
                }


            // view: shadepoints
            } else if(viewSetup.mode === "shadedPoints") {
                shadePoint(i)
                i.afterImage.forEach((a, idx, arr) => shadePoint(a, {lightStrenth:50*(2-a.alpha)}));



            // view: id
            } else  if (viewSetup.mode === "id") ctx.fillText(idx, i.projX, i.projY)
            
            else arr.forEach((j, jIdx) => {
                if (skipLoop) return

                // const dis = closeToPoint(i, j, pointsSetup.connectionDistance);
                // if (pointsSetup.clusterReach) {
                //     const clusterDis = closeToPoint(i, j, pointsSetup.clusterReach);
                //     if (clusterDis) clusterSize += 1
                // }

                // if (clusterSize >= pointsSetup.maxClusterSize) {
                //     i.changeCharge()
                // }

                if (dis && dis.x > 0) {
                    // points move toward earch other
                    if (pointsSetup.attractionForce) {
                        const change = posTowards(i, j, (pointsSetup.attractionForce * (100 - ((posInt(dis.x) + posInt(dis.y))) / 2) / 100) * (pointsSetup.margaticMode ? arr[idx].charge : 1))
                        arr[idx].x += change.x
                        arr[idx].y += change.y
                    }
                    //view: lines
                    if (viewSetup.mode === "lines") {
                        ctx.lineWidth = sqrt(i.alpha ** 2 + j.alpha ** 2)
                        line(i.projX, i.projY, j.projX, j.projY, thisColor)

                    // view: shapes
                    } else if (viewSetup.mode === "shapes" && conn.length >= 3) {
                        ctx.beginPath()
                        ctx.moveTo(i.projX, i.projY)


                        conn.forEach(c => {
                            ctx.lineTo(c.projX, c.projY)
                        })

                        if (viewSetup.color) ctx.fillStyle = hsl(conn.map(i => i.color).reduce((t, i) => t * i) / conn.length) //`#${ hex(round(conn.map(i=>i.color).reduce((t, i)=>t*i)/conn.length), 3).split(0, 8)[0] + '3F' }`
                        else {
                            ctx.fillStyle = hsl((360 / 20) * connCount)
                        }
                        ctx.fill()
                        conn = []
                    } else {
                        connCount += 1
                        conn.push(j)
                    }
                }
            })
        })
    }
}


// get cirlce points
function getCirclePoints(mx = Xmin, my = Ymin) {
    const res = []
    if (centerSetup.singlePoint) {
        const p = new Point(0)
        p.x = mx;
        p.y = my;
        p.z = centerSetup.z;
        p.i = 0;
        res.push(p)
    } else {
        const r = centerSetup.radius
        for (let i = 0; i < 360; i++) {
            const a = degRad(i);
            let x1 = mx + Math.cos(a) * r;
            let y1 = my + Math.sin(a) * r;
            if (i % round(centerSetup.detail) === 0) {
                const p = new Point(i)
                p.x = x1;
                p.y = y1;
                p.z = centerSetup.z;
                p.i = i;
                res.push(p)

            }
        }
    }

    res.forEach(i => i.project())
    return res
}

function shadePoint(p, {lightStrenth= 100, invert=true}={}) {
    const {projX:x, projY:y, z, size: s, color:cl} = p
    if(s<=0 || !s)return
    const light = posTowards(p, viewSetup.lightSource)


    lightStrenth = 100*p.alpha//50*(2-p.alpha)
    
    if(lightStrenth<=0)lightStrenth=1
    let lightPos = s/2



    const grd = ctx.createRadialGradient(x, y, s, x+Math.cos(light.a)*s, y+Math.sin(light.a)*s, lightPos);
    // const grd =ctx.createLinearGradient(x, y, x+Math.cos(angle)*s, y+Math.sin(angle)*s);

    grd.addColorStop(0, hsl(cl, viewSetup.color?0:50, lightStrenth/4));
    grd.addColorStop(0.5, hsl(cl, viewSetup.color?0:100, lightStrenth/2));
    grd.addColorStop(1, hsl(cl,viewSetup.color?0:100, lightStrenth*0.9));

    circle(x, y, s, null, grd)
}








function setupControlls(html = false) {
    if(html) {
        Controls.create("depth", "range")

        Controls.input.onchange = async(e)=> {
            pause = true
            await sleep(0.5)
            viewSetup.depth = e.target.value
            pause = false
        }
        Controls.add()




    }
}

const circlePoints = getCirclePoints()
const Zmax = viewSetup.depth / 2

if(viewSetup.mode !== "shadedPoints") ctx.invert()



// cnv.style.filter = 'invert(1) blur(1px)'
ctx.lineWidth = 0.5

// Main function/init
async function main() {
    setupControlls()

    const m = incrementer.init(pause.toggle(), 10)
    const Pointz = new Points(pointsSetup.amount)
    async function animation() {
        clear("#000")
        Pointz.showMovement()
       // pause = true
        await pauseHalt()
        if (!exit) requestAnimationFrame(animation)
    }

    animation()
}
main()









