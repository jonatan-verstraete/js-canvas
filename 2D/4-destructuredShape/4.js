const viewSetup = Object.freeze({
    color: true,
    mode: ["lines", "points", "shapes", "id"][1]
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
    amount: 20,
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
        this.targets = []
    }
    move() {
        this.x += this.speed.x * this.velocity
        this.y += this.speed.y * this.velocity

        if (this.x > Xmax || this.x < Xmin) this.resetPos()
        if (this.y > Ymax || this.y < Ymin) this.resetPos()
    }
    resetPos() {
        this.x = this.src.x
        this.y = this.src.y
    }
    assignTarget(t) {
        this.target = {
            x: t.x,
            y: t.y,
        };
        const targ = posTowards(this, this.target)
        this.targets.push(targ)

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
        this.points.forEach((i, idx, arr) => {
            if(i.reached || distanceTo(i, i.target) <= pointsSetup.targetMinDistance) {
                arr[idx].reached = true
            } else {
                line(i.src.x, i.src.y, i.target.x, i.target.y, "#ff00003f")
                point(i.target.x, i.target.y, 10, "blue")
                point(i.src.x, i.src.y, 10, "red")
                i.move()
            }
            markPoint(i.x, i.y, i.reached ? 20 : 30, {txt: str(idx),  stroke: i.reached ? "purple" : "cyan"})
        })
        if(this.points.filter(i=>i.reached).length>=this.points.length) return true
    }
}

/*


points = range(pointsSetup.amount*30).map(i=>({x:randint(Xmax), y:randint(Ymax), inZone:false})) // [{x:Xmid, y:Ymid}]// 
points.push(
    {x:shape.pts[0].x, y:shape.pts[0].y},
    {x:shape.pts[1].x, y:shape.pts[1].y},
    {x:shape.pts[2].x, y:shape.pts[2].y}
);

log(points, shape.pts)


// points.forEach(i=> {
//     i.inZone = isPointInShape(i, shape.pts)
//     //log(i, i.inZone)
// })

// points.forEach((i, idx)=>markPoint(i.x, i.y, i.inZone ? 3 : 2, {stroke: i.inZone ? "#fff" : "cyan", txt: (idx)}))
*/


function getCirclePoints(mx = Xmid, my = Ymid) {
    const res = []
    const r = mainSize
    const detail = 50
    for (let i = 0; i < 360; i++) {
        const a = degRad(i);
        let x1 = mx + Math.cos(a) * r;
        let y1 = my + Math.sin(a) * r;
        if (i%detail===0 && (detail===1 || i!=0)) res.push({
            x: x1,
            y: y1,
            i: i
        })
        if (i%detail===0 && (detail===1 || i!=0)) point(x1, y1, 10, "orange")
    }
    return {size: r, pts: res};
}

function getShape() {
    return getCirclePoints()
    const res = []
    const s = mainSize, x=Xmid, y = Ymid, r = 0.519;

    triangle(Xmid, Ymid, s, false, {stroke: "gray"})

    const a = ((Math.PI * 2) / 3);
    for (let i = 0; i < 3; i++) {
        point(x+s* Math.cos(a*i+r), y+s* Math.sin(a*i+r), 20, "orange");
        res.push({
            x: round(x+s* Math.cos(a*i+r)), 
            y: round(y+s* Math.sin(a*i+r)),
        })
    }
    return {size: s, pts: res};
}


const mainSize = 200
const magicNumber = 6.935

const main = async()=> {
    const Shape = getShape() 
    const points = new Points(pointsSetup.amount)

    points.points.forEach(i=> 
        i.assignTarget( Shape.pts[randint(Shape.pts.length-1)] ) 
    )

    ctx.font = 200+"px verdana"
    ctx.fillText("~2.388..", Xmid-("~2.388..".length*50), Ymid-300)

    while(!exit) {
        clear()
        const res = points.showMovement()
        if(res) exit = true
        await sleep(0.01)
        await pauseHalt()
    }
}

main()