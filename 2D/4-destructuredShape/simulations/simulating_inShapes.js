const viewSetup = Object.freeze({
    color: true,
    mode: ["lines", "points", "shapes", "id"][2]
})

const centerSetup = Object.freeze({
    size: 80,
    force: 3,
    attractionDistance: 120,
    detail: 20,
    show: false
})

const pointsSetup = Object.freeze({
    size: 5, 
    amount: 150,
    speed: 3,
    targetMinDistance: 30,
    attractionForce: 3,
    afterIamgeCount: 0,
    connectionDistance: 140,
    margaticMode: true,
    lifespan: 20,
})

const ruleSetup = Object.freeze({
    maxClusterSize: 5,
    clusterReach: 10,
})

const main = async () => {
    class Point {
        constructor() {
            this.margin = 100
            this.x = randint(this.margin, Xmax-this.margin)
            this.y = randint(this.margin, Ymax-this.margin)
            this.velocity = 10
            this.reached = false
            this.src = {
                x: this.x,
                y: this.y,
            }
            this.speed = {
                x: 0,
                y: 0,
            }
            this.originalSpeed = this.speed
            this.target = null
        }
        move() {
            this.x += this.speed.x * this.velocity
            this.y += this.speed.y * this.velocity

            if (this.x > Xmax) this.resetPos()//            if (this.x > Xmax) this.x = this.src.x
            if (this.x < Xmin) this.resetPos()//            if (this.x < Xmin) this.x = this.src.x
            if (this.y > Ymax) this.resetPos()//            if (this.y > Ymax) this.y = this.src.y
            if (this.y < Ymin) this.resetPos()//            if (this.y < Ymin) this.y = this.src.y
        }
        resetPos() {
            this.x = this.src.x
            this.y = this.src.y
        }
        assignTarget() {
            this.target = {
                x: randint(this.margin, Xmax-this.margin),
                y: randint(this.margin, Ymax-this.margin),
            };
            const targ = posTowards(this, this.target)
            this.speed = {
                x: targ.x,
                y: targ.y,
            }
        }
    }

    // points class
    class Points {
        constructor(amount) {
            this.points = [...new Array(amount)].map(i => new Point())
        }
        assignTargets() {
            this.points.forEach((i,idx, arr)=>i.assignTarget(arr[idx+1] || arr[0]))
        }
        showMovement() {


            function closeToCenter(a, r = 150) {
                const res = []
                for(let i of circlePoints) {
                    const disX = inRange(a.x, i.x, r, true) || inRange(i.x, a.x, r, true)
                    const disY = inRange(a.y, i.y, r, true) || inRange(i.y, a.y, r, true)
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

                if(i.reached || closeTo(i, i.target, pointsSetup.targetMinDistance)) {
                    markPoint(i.x, i.y, 20, {txt: str(idx), stroke: "purple"})
                    arr[idx].reached = true
                    return
                } 
                if(!i.reached) {
                    line(i.src.x, i.src.y, i.target.x, i.target.y, "#ff00003f")
                    point(i.target.x, i.target.y, 10, "blue")
                    point(i.src.x, i.src.y, 10, "red")
                }
                i.move()
                markPoint(i.x, i.y, pointsSetup.targetMinDistance, {txt: str(idx)})
                if(pause) log(i)
            })
            if(this.points.filter(i=>i.reached).length>=this.points.length) return true
        }
    }



    let points = new Points(pointsSetup.amount)
    points.assignTargets()

    let limit = 0
    const stats = {
        succes: 0,
        failed: 0
    }

    const simulationMode = true


    while(!exit) {
        clear()
        points.showMovement()
        await pauseHalt()
        await sleep(0.01)
    }
}

// ctx.fillText("~2.388..", Xmid-("~2.388..".length*50), Ymid-300)






let mainSize = 200
const magicNumber = 5.8//6.935

function getCirclePoints(mx = Xmid, my = Ymid, rot) {
    const res = []
    const r = mainSize
    for (let i = 0; i < 360; i++) {
        const a = degRad(overcount(i + rot, 360));
        let x1 = mx + Math.cos(a) * r + randint(rot);
        let y1 = my + Math.sin(a) * r;
        if (i % round(30) === 0) res.push({
            x: x1,
            y: y1,
            i: i
        })
        if (i % round(30) === 0) point(x1, y1, 10, "orange")
    }
    return {size: r*2, pts: res};
}

function getShape(show = true, pr = 0) {
    // return getCirclePoints(Xmid, Ymid, pr)
    const res = []
    let s = mainSize, x=Xmid, y = Ymid, r = 0.519 + pr;

    if(show) triangle(Xmid, Ymid, s, false, {stroke: "gray"})

    const a = ((Math.PI * 2) / 3);
    for (let i = 0; i < 3; i++) {
        if(show) point(x+s* Math.cos(a*i+r), y+s* Math.sin(a*i+r), 20, "orange");
        res.push({
            x: round(x+s* Math.cos(a*i+r)), 
            y: round(y+s* Math.sin(a*i+r)),
        })
    }
    return {size: s, pts: res};
}


function insideOfShape(shape, points) {

    points = range(pointsSetup.amount).map(i=>({x:randint(Xmax), y:randint(Ymax), inZone:false})) // [{x:Xmid, y:Ymid}]// 
    points.push(
        {x:shape.pts[0].x, y:shape.pts[0].y},
        {x:shape.pts[1].x, y:shape.pts[1].y},
        {x:shape.pts[2].x, y:shape.pts[2].y}
    );



    const res = []
    points.forEach((i, idx)=>{ 
        const disN = []
        
        shape.pts.forEach(p=>disN.push(distanceTo(i, p, true)))

        if(toFixed(disN.reduce((t, i)=>t+=i)/shape.size, 3) <= magicNumber) i.inZone = true
        if(i.inZone === true) res.push(toFixed((round(disN.reduce((t, i)=>t+=i))/shape.size)/shape.pts.length, 3)) 
        // if(i.inZone)  shape.pts.forEach((j, idx2)=>{
        //     linei.x, i.y, j.x, j.y)

        //     const m = posTowards(i, j, 20)
        //     ctx.font = `${14}px verdana`
        //     ctx.fillStyle = "orange"
        //     ctx.fillText(toFixed(disN[idx2], 3), i.x+m.x, i.y+m.y)

        // })
        
        // log(idx+"|", 
        //     //round(disN.reduce((t, i)=>t+=i)), 
        //     disN, 
        //     round(disN.reduce((t, i)=>t+=i))/shape.size, "_",
        //     toFixed((round(disN.reduce((t, i)=>t+=i))/shape.size)/shape.pts.length, 3)
        // )
        
    })
    points.forEach((i, idx)=>markPoint(i.x, i.y, i.inZone ? 30 : 20, {stroke: i.inZone ? "red" : "cyan", txt: (idx)}))
    return res



}






async function simulate() {
    const stats = []
    const simulationMode = true


    let i = 0, exit = false;

    while(!exit) {
        i++
        if(i>100) exit = true
        clear()
        if(simulationMode) {
            const shapeData = getShape(true) 
            const res = insideOfShape(shapeData)

            stats.push(res)
           // textCenter("SIMULATING", 100)

            await sleep(0.1)
            if(pause) log(stats)
            await pauseHalt()
            
        } else {
            points.showMovement()
            await pauseHalt()
            await sleep(0.5)
        }
    }
    log("stats: ", stats)
    return stats.length>0 && stats[0].length>0 ? stats.map(i=>i.average()).sortDc() : "-"
}

async function a() {
    const res = []
    for(let i of range(10)) {
        const r = await simulate()
       // mainSize = i/2 * 100
        log("D:", mainSize ,r[0])
        log("")
        res.push()
        await sleep(0.5)
        await pauseHalt()
    }
    log(res.sortDc())
}



point(Xmid, Ymid, 20, "red")

// triangle(Xmid, Ymid, mainSize*2,false, {rotate:0})
simulate()
//BaseTriangleEffect(Xmid, Ymid, mainSize*2)

/*
// a()

const shape = getShape(false) 

shape.pts.forEach((j, idx, arr)=>{
    ctx.font = `${14}px verdana`
    ctx.fillStyle = "#cc33003f"
    ctx.strokeStyle = "#cc33003f"

    let i = arr[idx+1] || arr[0]
    linei.x, i.y, j.x, j.y)


    const m = distanceTo(i, j)
    const p = posTowards(i, j, mainSize/1.2)


    // ctx.fillText( `${["A", "B", "C"][idx]} -> ${["A", "B", "C"][arr.indexOf(i)]}=${round(m.x)};${round(m.y)}` , i.x+p.x, i.y+p.y)
})

shape.pts.forEach((i, idx)=> {
    ctx.font = `${24}px verdana`
    ctx.fillText( ["A", "B", "C"][idx] , i.x, i.y)
})


function showDis(po) {
    const dis =[]
    shape.pts.forEach((j, idx, arr) => {
        let i = po

        ctx.font = `${10}px verdana`
        ctx.fillStyle = "green"
        ctx.strokeStyle = "green"

        const m = distanceTo(i, j)
        const p = posTowards(i, j, round(m.x+m.y)/2)

        dis.push({...m, t: round(m.x+m.y)})


        linei.x, i.y, j.x, j.y)
        ctx.fillText(`X -> ${["A", "B", "C"][idx]}=${round(m.x)};${round(m.y)}`, i.x + p.x, i.y + p.y)
    })
    ctx.fillStyle = "#0f7"
    ctx.fillText(dis.reduce((i, j)=>{
        if(isObj(i)) i = i.t;
        i+=int(j.t)
        return i
    }), po.x, po.y)
}
let c = 111
const pxs = [
   // {x: Xmid, y:shape.pts[0].y},
    //{x: Xmid, y:shape.pts[0].y-200},
    {x: shape.pts[0].x-c, y:shape.pts[2].y+c},


]

for(let i of pxs) {
    showDis(i)
}

//*/