const main = async () => {
    const fillShapes = true
    const connectionDistance = 140
    const amountOfPoints = 100
    const centerRadius = 80
    const circleVisualisation = false
    const circlePoints = circleVisualisation? getCirclePoints() : []



    cnv.style.filter = "invert(1) blur(2px)"
    ctx.lineWidth = 0.5

    function getCirclePoints(mx=Xmid, my=Ymid, {detail= 1}={}) {
        const res = []
        const r = centerRadius
        for(let i = 0; i< 360;i++){
            const a = degRad(i);
            let x1 = mx + Math.cos(a) * r;
            let y1 = my + Math.sin(a) * r;
            res.push({x:x1, y:y1})
        }
        return res
    }

    class PointC {
        constructor(speed = 10) {
            this.x = randint(Xmax)
            this.y = randint(Ymax)
            this.speed = {
                x: randfloat(-speed, speed),
                y: randfloat(-speed, speed)
            }
            this.connections = 0
            this.originalSpeed = this.speed
        }
        move() {
            this.x += this.speed.x
            this.y += this.speed.y
            if (this.x > Xmax) this.speed.x *= -1 //this.x = Xmin
            if (this.y > Ymax) this.speed.y *= -1 //this.y = Ymin
            if (this.x < Xmin) this.speed.x *= -1 //this.x = Xmax
            if (this.y < Ymin) this.speed.y *= -1 //this.y = Ymax
        }

        resetSpeed() {
            this.speed.x = this.originalSpeed.x
            this.speed.y = this.originalSpeed.y
        }

    }

    // points class
    class Points {
        constructor(amount) {
            this.points = [...new Array(amount)].map(i => new PointC())
            this.hexScale = 4095/this.points.length
        }
        asignColors() {
            this.points.forEach((i,idx)=>i.color = round((idx * this.hexScale) + 1))
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

            function closeToCenter(a, r = 150) {
                const res = []
                for(let i of circlePoints) {
                    const disX = inRange(a.x, i.x, r, true)
                    const disY = inRange(a.y, i.y, r, true)
                    if(disX && disY) {
                        res.push({
                            d: posInt(disX) + posInt(disY),
                            i: i,
                        })
                    }
                }
                return res ? res.sortAc("d")[0] : false
            }

            this.points.forEach((i, idx, arr) => {
                i.move()
                const cp = closeToCenter(i, 50)
                if(circleVisualisation && cp) {
                    line(i.x, i.y, cp.i.x, cp.i.y)
                } else {
                    let conn = []
                    let connCount = 0
                    arr.forEach((j, jIdx) => {
                        const dis = closeTo(i, j, connectionDistance);
                        if (dis) {
                            if(!fillShapes) {
                                ctx.strokeStyle = `#${ hex(i.color) }`
                                //shade()
                                line(i.x, i.y, j.x, j.y)


                                // arr[idx].speed.x = (connCount/100) - arr[idx].originalSpeed.x
                                // arr[idx].speed.y = (connCount/100) + arr[idx].originalSpeed.y
    
                            } else if(conn.length === 3) {
                                ctx.beginPath()
                                ctx.moveTo(i.x, i.y)
                                conn.forEach(c=> {
                                    ctx.lineTo(c.x, c.y)
                                })
                                ctx.fillStyle = `#${ hex(round(conn.map(i=>i.color).reduce((t, i)=>t*i)/conn.length), 3) }`


                                ctx.fill()
                                conn = []
                            } else {

                                // connCount+=1
                                // const fill = round((256/20) * connCount)
                                // ctx.fillStyle = `rgb(${fill},${fill},${fill},${0.5})`

                                conn.push(j)
                            }
                        }
                    })
                }
                //ctx.fillText(idx, i.x, i.y)
                // square(i.x, i.y)
            })
        }
    }



    const points = new Points(amountOfPoints)
    points.asignColors()


    while(!exit) {
        clear()
        points.showMovement()
        await pauseHalt()
        await sleep(0.01)
    }
}

main()