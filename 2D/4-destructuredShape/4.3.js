const viewSetup = Object.freeze({
    color: true,
    mode: ["lines", "points", "shapes"][2],
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
    afterIamgeCount: 5,
    connectionDistance: 80,
    connectionAmount: 3,
    lifespan: 20,
    replayStop: 0,
})

const ruleSetup = Object.freeze({
    maxClusterSize: 5,
    clusterReach: 0,
})

const mainSize = 200
let pointsStartPos = 0

// point class
class Point {
    constructor(id, totalLength) {
        this.id = id
        this.margin = 100
        this.randPosInt = 2//randint(3)
        this.x = [0, Xmax, Xmid, Xmax, Xmin, randint(this.margin, Xmax - this.margin)][overcount(pointsStartPos, 6)]
        this.y = [0, Ymax, Ymid, Ymin, Ymax, randint(this.margin, Xmax - this.margin)][overcount(pointsStartPos, 6)]
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
        return this.reached = true
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
            y: toFixed(targ.y, 3),
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
                if(!i.reached ) {
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
                        if(viewSetup.color) ctx.strokeStyle = `#${ hex(i.color) }`
                        line(i.x, i.y, j.x, j.y)

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
        }
    }
}


async function getShape(image) {
    const res = []  
    const size = 1*image.size || 1
    const skipSteps = image.loss
    const grayAllowance = 49

    await drawImage(image.src, size, 80) 
    

    const x0=50,
        y0=50,
        xn=Xmax-200/size,
        yn=Ymax-50/size;

    const imgData = ctx.getImageData(x0, y0, xn, yn);
    const data = arrayChuck([...imgData.data], 4)
    
    let idx = 0
    for (let y = 0; y < imgData.height; y += 1) {
        for (let x = 0; x < imgData.width; x += 1) {
            if(idx%skipSteps === 0){
                let cData = data[idx] || []
                if(cData[0] <= grayAllowance && cData[3] != 0) {
                    res.push({
                        x: toFixed(x0+x),
                        y: toFixed(y0+y),
                    })
                }
            }
            idx += 1
        }
    }
    clear()
    return res
}

function makeEquilateralTriangle(a, b, middlePoint = centerObj) {    
    function getMid(pos  = true) {
        const s60 = sin(60 * PI / 180.0) * pos ? 1 : -1;    
        const c60 = cos(60 * PI / 180.0);
    
        const X = c60 * (a.x - b.x) - s60 * (a.y - b.y) + b.x
        const Y = s60 * (a.x - b.x) + c60 * (a.y - b.y) + b.y
        return {x:X, y:Y}
    }

    const posDis = getMid(true)
    const negDis = getMid(false)

    return [a, b, distanceTo(middlePoint,posDis) > distanceTo(middlePoint,negDis) && middlePoint ? negDis : posDis]
}



function getMiddleOfPionts(arr, precise = 150) {
    const stakeLength = arr.length < precise ? arr.length : precise
    const p = shuffleArray([...arr]).slice(0, stakeLength)
    const mx = p.reduce((i, j)=>i+=j.x, 0)/stakeLength
    const my = p.reduce((i, j)=>i+=j.y, 0)/stakeLength
    return {x:mx, y:my}
}



const showFigure = async (image) => {
    return new Promise(async(resolve, reject)=> {

        const Shape = await getShape(image)
        
        // Shape.forEach(i=>{
        //     point(i[0].x, i[0].y, 1, "red")
        //     point(i[1].x, i[1].y, 1, "red")
        //     point(i[2].x, i[2].y, 1, "red")
        // })


        const shapePoints = Shape.flat()

        let points = new Points(shapePoints.length)

        points.points.forEach((i, idx)=> 
            i.assignTarget( shapePoints[idx] , true) 
        )

        await sleep(1)

        let res = false
        while(!res) {
            clear()
            res = points.showMovement()
            await sleep(0.01)
            await pauseHalt()
            if(res) return resolve("hoi")
        }
        
    })
}


const Main = async ()=> {
    const imgs = [{src:"brain.png", loss: 148, size: 0.6}, {src:"face.png", loss: 8, size:1},{src:"hand.png", loss: 200, size: 0.5}]
    let idx = 0
    while(!exit) {
        await showFigure(imgs[overcount(idx, imgs.length)])
        await sleep(1)
        await pauseHalt()
        idx++
        pointsStartPos = idx
    }
}

Main()