const viewSetup = Object.freeze({
    color: false,
    mode: ["lines", "points", "shapes"][0],
    devmode: false,
})

const shapeSetup = Object.freeze({
    size: 80,
    detail: 7,
})

const pointsSetup = Object.freeze({
    size: 10,
    speed: 10,
    reassignTargetInstant: false,
    reassignTargetRepeat: true,
    targetMinDistance: 8,
    afterIamgeCount: 6,
    connectionDistance: 90,
    connectionAmount: 3,
    lifespan: 20,
    replayStop: 0,
})

const ruleSetup = Object.freeze({
    maxClusterSize: 5,
    clusterReach: 0,
})

const mainSize = 200
const centerPoints = [...getShape()]


// point class
class Point {
    constructor(id, totalLength) {
        this.id = id
        this.margin = 100
        this.x = randint(this.margin, Xmax - this.margin)
        this.y = randint(this.margin, Ymax - this.margin)
        this.velocity = pointsSetup.speed
        this.reached = false
        this.src = {
            x: this.x,
            y: this.y,
        }
        this.srcTarget ={
            x: 0,
            y: 0,
        }
        this.speed = {
            x: 0,
            y: 0,
        }
        this.target = null
        this.targets = []
        this.color = viewSetup.color ? round(((4095/totalLength)*id) + 1) : "#000"
        this.afterImage = []
    }
    move(boost = 1) {
        if(pointsSetup.afterIamgeCount && viewSetup.mode === "points") this.addAfterImage({
            x: this.x,
            y: this.y,
            color: hexToRgb(this.color, {formatted: true, h: (1/pointsSetup.afterIamgeCount)* this.afterImage.length})
        })
        this.x += this.speed.x * this.velocity * boost
        this.y += this.speed.y * this.velocity * boost

        if (this.x > Xmax || this.x < Xmin) return this.resetPos()
        if (this.y > Ymax || this.y < Ymin) return this.resetPos()
    }
    resetPos() {
        this.x = this.src.x
        this.y = this.src.y
    }
    assignTarget(t, initial = false) {
        this.reached = false;

        this.target = {
            x: t.x,
            y: t.y,
        };
        if(initial && this.targets.length == 0) this.srcTarget = Object.copy(this.target)

        const targ = posTowards(this, this.target)
        this.targets.push(this.target)
        this.speed = {
            x: toFixed(targ.x, 3),
            y: toFixed(targ.y, 3)
        }
    }
    switchTargets() {
        this.reached = false;

        if(this.x == this.srcTarget.x && this.y == this.srcTarget.y ) {
            this.assignTarget(this.src)
        } else {
            this.assignTarget(this.srcTarget)
        }
    }
    die(points) {
        points.splice(this.id,1, new Point(this.id))
    }
    addAfterImage(n) {
        this.afterImage.push(n)
        if(this.afterImage.length > pointsSetup.afterIamgeCount) this.afterImage.shift()
    }
}


// points class
class Points {
    constructor(amount) {
        this.points = [...new Array(amount)].map((i, idx) => new Point(idx, amount))
    }
    assignTargets() {
        this.points.forEach((i, idx, arr) => i.assignTarget(arr[idx + 1] || arr[0]))
    }
    reAssignTargets() {
        this.points.forEach(i=> i.switchTargets())
    }
    showMovement() {
        this.points.forEach((i, idx, arr) => {
            if (i.reached || distanceTo(i, i.target) <= pointsSetup.targetMinDistance) {
                if(pointsSetup.reassignTargetInstant){
                    i.switchTargets()
                } else if(!i.reached ) {
                    i.x = i.target.x
                    i.y = i.target.y
                    arr[idx].reached = true
                }
            } else {
                i.move()
            }
            let conn = []
            let connCount = 0

            if(i.lifeTime > pointsSetup.lifespan) {
                i.die(this.points)
            } 



            if (viewSetup.mode === "points") {
                point(i.x, i.y, pointsSetup.size, hex(i.color, 3, true));  
                if(pointsSetup.afterIamgeCount) i.afterImage.forEach((a, idx, arr)=>point(a.x, a.y, (pointsSetup.size/arr.length)*idx, a.color));
            }
            else arr.forEach((j, jIdx) => {
                if(connCount > pointsSetup.connectionAmount) return
                const dis = closeTo(i, j, pointsSetup.connectionDistance);

                if (dis && dis.x > 0) {
                    // points movet toward earch other
                    if (viewSetup.mode === "lines") {
                        if(viewSetup.color) ctx.strokeStyle = hex(i.color, 3, true)
                        line(i.x, i.y, j.x, j.y,  hex(i.color, 3, true))

                    } else if (viewSetup.mode === "shapes" && conn.length >= pointsSetup.connectionAmount) {
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

        if (this.points.filter(i => i.reached).length >= this.points.length) {
            return true
            return pointsSetup.reassignTargetRepeat ? this.reAssignTargets() : true
        }
    }
}



function getShape(newShape = false, multiple = false) {
    const enlarge = 2.3
    const pts = [{
            x: Xmid - 300 * enlarge,
            y: Ymid + 200 * enlarge
        },
        {
            x: Xmid + 250 * enlarge,
            y: Ymid + 200 * enlarge
        },
        {
            x: Xmid + 100 * enlarge,
            y: Ymid - 50 * enlarge
        },
    ]
    if(newShape) return [...new Array(3)].map(i=>({
        x: randint(Xmax),
        y: randint(Ymax)
    }))

    const b= arrayChuck([...new Array(9)].map(i=>({
        x: randint(Xmax),
        y: randint(Ymax)
    })), 3)
    return multiple ? b : pts
}


function shapedelicYeahBabyYeah(shapes) {
    const res = [...shapes]
    let mainArea = null

    function recursiveSplitting(shape, deepness=0) {
        const show = {
            all: false,
            names: false,
            lines: false,
            area: false,
        };
    
        if (deepness <= 0 || !shape) return false
    
        function getCorners(pts) {
            const a = distanceTo(pts[1], pts[2]),
                b = distanceTo(pts[2], pts[0]),
                c = distanceTo(pts[0], pts[1]);
    
            const A = (Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c))),
                B = (Math.acos((a ** 2 + c ** 2 - b ** 2) / (2 * a * c))),
                C = (Math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b)));
    
            const corners = [A, B, C].map(i => toFixed(i, 3))
            const area = toFixed(((a * b * sin(C)) / 2) / 1000, 4)
            if(mainArea === null) mainArea = area


    
            const cenC = {
                x: (pts[0].x + pts[1].x) / 2,
                y: (pts[0].y + pts[1].y) / 2
            }
    
            if (viewSetup.devmode ? true : false) {
                line(pts[2], cenC)
    
                if (show.area||show.all) fillText("a=" + area, Xmid, Ymid + 190, 50, {
                    color: "#ff0ff03F"
                }, 20)
                pts.forEach((i, idx, arr) => {
                    const p = arr[overcount(idx + 1, arr.length)]
                    const disP = distanceTo(i, p)
                    const pt = posTowards(i, p, disP / 2)
                    const sign = ["a", "b", "c"][idx]
    
                    line(i.x, i.y, p.x, p.y, "brown")
                    if (show.names||show.all) fillText(sign + "=" + corners[idx], i.x, i.y, 50, {
                        color: "orange"
                    })
                    if (show.lines||show.all) fillText(["a", "b", "c"][overcount(idx + 2, 3)] + "=" + disP, i.x + pt.x, i.y + pt.y, 30, {
                        color: "purple"
                    })
                })
            }

            return {
                a: [
                    pts[0],
                    pts[2],
                    cenC,
                ],
                b: [
                    pts[1],
                    pts[2],
                    cenC,
                ],
                point: cenC,
                area: area
            }
        }
    
        const newShape = getCorners(shape)
        recursiveSplitting(newShape.b, deepness-1)
    
        res.push(newShape.point)
        return recursiveSplitting(newShape.a, deepness-1)
    }
    recursiveSplitting(shapes, shapeSetup.detail)
    if(mainArea < 50) {
        return shapedelicYeahBabyYeah(getShape(true))
    }
    return res
}



const main = async () => {
    const Shape = getShape(true)

    const shapePoints = shapedelicYeahBabyYeah(Shape)

    let points = new Points(shapePoints.length)

    points.points.forEach((i, idx)=> 
        i.assignTarget( shapePoints[idx] , true) 
    )

    await sleep(1)

    while(!exit) {
        clear()
        const res = points.showMovement()
        if(res) {
            const newShapePoints = shapedelicYeahBabyYeah(getShape(true))

            points.points.forEach((i, idx)=> {
                if(pointsSetup.replayStop && i.targets.length >= pointsSetup.replayStop) {
                    // log(i.targets)
                    // log(i.targets[overcount(i.targets.last(2, true), i.targets.length)])
                    // exitting()
                    i.assignTarget( i.targets[overcount(i.targets.last(2, true), i.targets.length)] , true) 
                } else {
                    i.assignTarget( newShapePoints[idx] , true) 
                }
            })
        }
       // if(res) exit = true
        await sleep(0.01)
        await pauseHalt()
    }
}

main()