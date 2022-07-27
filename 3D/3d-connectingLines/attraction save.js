const viewSetup = Object({
    color: true,
    mode: ["lines", "points", "shapes", "id"][1],
    depth: 500,
    maxDepth: 800,
    minDepth: 0,
    viewCenter: {x:Xmid, y:Ymid},
    zAdd: 0,
})

const centerSetup = Object.freeze({
    size: 80,
    force: 3,
    attractionDistance: 120,
    detail: 20,
    show: false,
    size: 5,
    radius: 300,
})

const pointsSetup = Object.freeze({
    maxSize: 10,
    minSize: 50,

    amount: 120,
    speed: 4,
    attractionForce: 0,
    afterIamgeCount: 0,
    connectionDistance: 140,
    margaticMode: true,
    lifespan: 20,
})

const ruleSetup = Object.freeze({
    maxClusterSize: 5,
    clusterReach: 10,
})

ctx.invert()

// point class
class Point {
    constructor(id, speed = pointsSetup.speed) {
        this.id = id

        this.theta = randfloat(PI2, false, 5)
        this.phi = randfloat(PI, false, 5)

        this.projScale = 0
        this.projX = 0
        this.projY = 0

        this.x = 0//randint(-viewSetup.viewCenter.x, viewSetup.viewCenter.x*2)
        this.y = 0//randint(-viewSetup.viewCenter.y, viewSetup.viewCenter.y*2)
        this.z = 0//randint(viewSetup.depth-50, viewSetup.depth)
        this.noff = 0

        this.size = 1
        this.speed = {
            x: randfloat(-speed, speed),
            y: randfloat(-speed, speed),
        }
        this.connections = 0
        this.originalSpeed = Object.copy(this.speed)
        this.lifeTime = 0;
        this.afterImage = []
        this.charge = id%2===0 ? -1 : 1
        this.color = ["#f00", "#0f0", "#00f"][randint(2)]// viewSetup.color ? round(((4095/pointsSetup.amount)*id)) : "#000"
        this.alpha = 1
    }

    project() {
        this.z-=3
        //if( this.z < viewSetup.minDepth) return
        this.projScale = viewSetup.depth/(viewSetup.depth+this.z)
        this.projX = (this.x * this.projScale) + viewSetup.viewCenter.x
        this.projY = (this.y * this.projScale) + viewSetup.viewCenter.y
        this.size = mapNums(this.z, 0, viewSetup.depth, pointsSetup.maxSize, pointsSetup.minSize)
        this.alpha = mapNums(this.z, 0, viewSetup.depth, 1, 0.3)

    }

    move() {
        this.x = centerSetup.radius * cos(this.phi) * sin(this.theta) 
        this.y = centerSetup.radius * sin(this.phi) 
        this.z = centerSetup.radius * cos(this.phi) * cos(this.theta) + centerSetup.radius

        this.noff += 0.01
        this.theta += 0.01
        this.project()
        // if(pointsSetup.afterIamgeCount && viewSetup.mode === "points") this.addAfterImage({
        //     x: this.x,
        //     y: this.y,
        //     color: hexToRgb(this.color, {formatted: true, h: (1/pointsSetup.afterIamgeCount)* this.afterImage.length}) 
        // })
        // if(this.size <= pointsSetup.minSize || this.size >= pointsSetup.maxSize) return



        // this.x += this.speed.x
        // this.y += this.speed.y


        // if (this.x > Xmax || this.x < Xmin) { this.resetSpeed('x')}
        // if (this.y > Ymax || this.y < Ymin) { this.resetSpeed('y')}
    }

    addAfterImage(n) {
        this.afterImage.push(n)
        if(this.afterImage.length > pointsSetup.afterIamgeCount) this.afterImage.shift()
    }

    resetSpeed (sign){
        this.speed[sign] = posInt(this.originalSpeed[sign]) * (isNeg(this.speed[sign]) ? 1 : -1)
        this[sign] += isNeg(this.speed[sign]) ? -10 : 10
        this.lifeTime += 1
    }

    die(points) {
        points.splice(this.id,1, new Point(this.id))
    }

    changeCharge() {
        this.charge *= -1
    }
}

// points class
class Points {
    constructor(amount) {
        this.points = [...new Array(amount)].map((i, idx) => new Point(idx))
    }
    showMovement() {
        this.points = this.points.sortAc('projScale')

        function closeToZ(a, b, r) {
            const disX = inRange(a.x, b.x, r, true)
            const disY = inRange(a.y, b.y, r, true)
            if (disX && disY) return {
                x: disX,
                y: disY
            }
            return false
        }
        function closeToCenter(p, r) {
            const res = []
            for (let i of circlePoints) {
                const disX = inRange(p.x, i.x, r, true)
                const disY = inRange(p.y, i.y, r, true)
                if (disX && disY) {
                    res.push({
                        d: posInt(disX) + posInt(disY),
                        dx: disX,
                        dy: disY,
                        dif: posInt(posInt(disX) - posInt(disY)),
                        p: i.i,
                        i: i,
                    })
                }
            }
            return res.length > 0 ? res.sortAc('d').slice(0, 3).sortAc('dif')[0] : false
        }


        
        this.points.forEach((i, idx, arr) => {
            i.move()
            let conn = []
            let connCount = 0
            let skipLoop = false;
            let clusterSize = 0;



            if (viewSetup.mode === "points") {
               //ctx.globalAlpha = i.alpha
               shadePoint(i)
               // point(i.projX, i.projY, i.size, hex(round((4095*i.alpha))), 3, true) //hex(i.color, 3, true) 
                if(pointsSetup.afterIamgeCount) i.afterImage.forEach((a, idx, arr)=>point(a.x, a.y, (i.size/arr.length)*idx, a.color));
            }

            else if (viewSetup.mode === "id") ctx.fillText(idx, i.x, i.y,)
            else arr.forEach((j, jIdx) => {
                if(skipLoop) return

                const dis = closeToZ(i, j, pointsSetup.connectionDistance);
                const clusterDis = closeToZ(i, j, ruleSetup.clusterReach);

                if(clusterDis) clusterSize+=1

                if(clusterSize >= ruleSetup.maxClusterSize){
                    i.changeCharge()
                    //return i.die(this.points)
                }

                if (dis && dis.x > 0) {
                    // points movet toward earch other
                    if(pointsSetup.attractionForce){
                        const change = posTowards(i, j, (pointsSetup.attractionForce * (100 -((posInt(dis.x)+posInt(dis.y)))/2)/100) * (pointsSetup.margaticMode?arr[idx].charge : 1))
                        arr[idx].x += change.x
                        arr[idx].y += change.y
                    }
                    if (viewSetup.mode === "lines") {
                        if(viewSetup.color) ctx.strokeStyle = hex(i.color, 3, true)
                        line(i.projX, i.projY, j.projX, j.projY)

                    } else if (viewSetup.mode === "shapes" && conn.length >= 3) {
                        ctx.beginPath()
                        ctx.moveTo(i.x, i.y)


                        conn.forEach(c => {
                            ctx.lineTo(c.x, c.y)
                        })

                        if(viewSetup.color) ctx.fillStyle = `#${ hex(round(conn.map(i=>i.color).reduce((t, i)=>t*i)/conn.length), 3).split(0, 8)[0] + '3F' }`
                        else {
                            const fill = round((256/20) * connCount)
                            ctx.fillStyle = `rgb(${fill},${fill},${fill},${0.5})`
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


function shadePoint(p, {lightStrenth= 100, grayscale=true, invert=true}={}) {
    try {
        const {projX:x, projY:y, z,size:s, color} = p
        if(s<=0 || !s)return
        const light = posTowards(p, {x:Xmax, y:Ymid})

        let cl=0;
        lightStrenth = 100*p.alpha//50*(2-p.alpha)
        
        if(lightStrenth<=0)lightStrenth=1
        let lightPos = s/2



        const grd = ctx.createRadialGradient(x, y, s, x+Math.cos(light.a)*s, y+Math.sin(light.a)*s, lightPos);
       // const grd =ctx.createLinearGradient(x, y, x+Math.cos(angle)*s, y+Math.sin(angle)*s);

        grd.addColorStop(0, hsl(cl, grayscale?0:50, lightStrenth/4));
        grd.addColorStop(0.5, hsl(cl, grayscale?0:100, lightStrenth/2));
        grd.addColorStop(1, hsl(cl,grayscale?0:100, lightStrenth*0.9));

        circle(x, y, s, null, grd)
    } catch (error) {
        log(error)
        log(1, p)
        exitting()
        return
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

const circlePoints = getCirclePoints()

//cnv.style.filter = 'invert(1) blur(1px)'
ctx.lineWidth = 0.5


async function main() {
    const Pointz = new Points(pointsSetup.amount)

    async function animation() {
        clear()
        viewSetup.zAdd+= 0.01
        Pointz.showMovement()
        await pauseHalt()
        // pause = true
        if(!exit) requestAnimationFrame(animation)
    }

    animation()
}
main()