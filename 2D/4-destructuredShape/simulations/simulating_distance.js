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

                if(i.reached || distanceTo(i, i.target) <= pointsSetup.targetMinDistance) {
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
                point(i.x, i.y, 2, "black")
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
        if(simulationMode) {
            const res = points.showMovement() || limit > 5000
            if(res === true) {
                textCenter("simulation", 100)
                await sleep(0.3)
                points = new Points(pointsSetup.amount)
                points.assignTargets()
    
                if(limit > 5000) stats.failed += 1
                else stats.succes += 1
    
                limit = 0
            }
            limit++
            if(pause) log(stats)
            await pauseHalt()
            
        } else {
            points.showMovement()
            await pauseHalt()
            await sleep(0.01)
        }
    }
}

main()