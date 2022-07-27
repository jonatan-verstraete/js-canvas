const viewSetup = Object.freeze({
    color: true,
    mode: ["lines", "points", "shapes", "id"][1]
})

const centerSetup = Object.freeze({
    radius: 100,
    force: 3,
    attractionDistance: 120,
    detail: 60,
    show: false
})

const pointsSetup = Object.freeze({
    size: 15, 
    lineWidth: 1,
    amount: 60,
    speed: 4,
    attractionForce: 3,
    afterIamgeCount: 7,
    connectionDistance: 140,
    margaticMode: false,
    lifespan: 20,
})

const ruleSetup = Object.freeze({
    maxClusterSize: 5,
    clusterReach: 10,
})

/*
    FIX:
    adding "pointsSetup.attractionForce", shoulden't cluster them to go one way
*/

const constructPoints = async () => {
    const circlePoints = getCirclePoints()

    //cnv.style.filter = 'invert(1) blur(1px)'
    ctx.lineWidth = 2.5

    function getCirclePoints(mx = Xmid, my = Ymid) {
        const res = []
        const r = centerSetup.radius
        for (let i = 0; i < 360; i++) {
            const a = degRad(i);
            let x1 = mx + Math.cos(a) * r;
            let y1 = my + Math.sin(a) * r;
            if (i % round(centerSetup.detail) === 0) res.push({
                x: x1,
                y: y1,
                i: i
            })
        }
        return res
    }

    // point class
    class Point {
        constructor(id, speed = pointsSetup.speed) {
            this.id = id
            this.x = randint(Xmax)
            this.y = randint(Ymax)

            this.speed = {
                x: randfloat(-speed, speed),
                y: randfloat(-speed, speed),
            }
            this.connections = 0
            this.originalSpeed = Object.copy(this.speed)
            this.lifeTime = 0;
            this.afterImage = []
            this.charge = id%2===0 ? -1 : 1
            this.color = viewSetup.color ? round(((4095/pointsSetup.amount)*id) + 1) : "#000"
        }

        move() {
            if(pointsSetup.afterIamgeCount && viewSetup.mode === "points") this.addAfterImage({
                x: this.x,
                y: this.y,
                color: hexToRgb(this.color, {formatted: true, h: (1/pointsSetup.afterIamgeCount)* this.afterImage.length})
            })
            this.x += this.speed.x
            this.y += this.speed.y
 

            if (this.x > Xmax || this.x < Xmin) { this.setSpeed('x')}
            if (this.y > Ymax || this.y < Ymin) { this.setSpeed('y')}
        }

        addAfterImage(n) {
            this.afterImage.push(n)
            if(this.afterImage.length > pointsSetup.afterIamgeCount) this.afterImage.shift()
        }

        setSpeed (sign){
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
            function closeTo(a, b, r) {
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

            if(centerSetup.show) circlePoints.forEach((i, idx)=>{
                ctx.lineWidth = 1
                point(i.x, i.y, pointsSetup.size*2, '#3ff8');
                ctx.fillStyle = "red"
                ctx.fillText(i.i, i.x, i.y)
                ctx.strokeStyle = "gray"                
                circle(i.x, i.y, centerSetup.radius, "#1118")
            })

            
            this.points.forEach((i, idx, arr) => {
                i.move()
                let conn = []
                let connCount = 0
                let skipLoop = false;
                let clusterSize = 0;

                const cp = closeToCenter(i, centerSetup.attractionDistance)
                if (cp) {
                    // move towards center
                    const change = posTowards(i, cp.i, (centerSetup.force * (100-cp.d/2)/100))
                    arr[idx].speed.x += change.x
                    arr[idx].speed.y += change.y
                    conn.push(cp.i)
                    arr[idx].lifeTime = 0

                } else if(i.lifeTime > pointsSetup.lifespan) {
                    i.die(this.points)
                } 


                if (viewSetup.mode === "points") {
                    point(i.x, i.y, pointsSetup.size, hex(i.color, 3, true));  
                    if(pointsSetup.afterIamgeCount) i.afterImage.forEach((a, idx, arr)=>point(a.x, a.y, (pointsSetup.size/arr.length)*idx, a.color));
                }

                else if (viewSetup.mode === "id") ctx.fillText(idx, i.x, i.y,)
                arr.forEach((j, jIdx) => {
                    if(skipLoop) return

                    const dis = closeTo(i, j, pointsSetup.connectionDistance);
                    const clusterDis = closeTo(i, j, ruleSetup.clusterReach);

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
                            const w = ((posInt(dis.x) + posInt(dis.y))/pointsSetup.connectionDistance) * pointsSetup.lineWidth
                            ctx.lineWidth = w
                            if(viewSetup.color) ctx.strokeStyle = `#${ hex(i.color) }`
                            line(i.x, i.y, j.x, j.y)

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

    return new Points(pointsSetup.amount)
}

async function main() {
    const Pointz = await constructPoints()

    async function animation() {
        clear()
        Pointz.showMovement()
        await pauseHalt()
        if(!exit) requestAnimationFrame(animation)
    }

    animation()
}



main()