const viewSetup = Object({
    color: ["none", "monotone", "shimmering", "setByDepth"][1],
    mode: ["points", "lines", "shapes", "id"][0],
    depth: 900,
    minDepth: 0,
    viewCenter: {x:Xmid, y:Ymid},
    viewDistance: 0,
    rotHorizontal: 1,
    rotVertical: 1,
    effetctX:1
})

const centerSetup = Object.freeze({
    radius: Xmid,
})

const pointsSetup = Object.freeze({
    maxSize: 6,
    minSize: 0.1,
    amount: 1020,
    speed: 0,
    attractionForce: 0,
    afterIamgeCount: 0,
    afterImageSpacing: 0,
    connectionDistance: 80,
    margaticMode: true,
    lifespan: 20,
    maxClusterSize: 5,
    clusterReach: 10,
})





// point class
class Point {
    constructor(id, speed = pointsSetup.speed) {
        this.alpha = 1
        this.theta = randfloat(0, PI2, 5)
        this.phi = randfloat(0, PI, 5)
        this.rotY = randfloat(0, PI, 5)

        this.projScale = 0
        this.projX = 0
        this.projY = 0

        this.x = 0
        this.y = 0
        this.z = 0
        this.id = id
        this.size = 1

        this.connections = 0
        this.lifeTime = 0;
        this.afterImage = []
        this.charge = id%2===0 ? -1 : 1
        this.rotSpeed = randfloat(0, PI/100, 5)
        this.afterImageSpacing = 0
        this.colorNum = (360/pointsSetup.amount )* id
        this.shimmeringSpeed = randint(0, 20)
    }


    project() {
       /*
       PLAY AROUNDS:
        this.x = ...sin(this.phi * viewSetup.rotVertical)... OR this.y
        =>* viewSetup.effetctX

        this.z = ...* tan(this.rotY)...

       */




        this.x = centerSetup.radius * tanh(this.phi)  * tan(this.theta) 
        this.y = centerSetup.radius * -tanh(this.phi)  * tan(this.rotY) 
        this.z = centerSetup.radius * sin(this.phi) * -tanh(this.theta) + centerSetup.radius


        this.projScale = viewSetup.depth/(viewSetup.depth+this.z) + viewSetup.viewDistance
        this.projX = (this.x * this.projScale) + viewSetup.viewCenter.x 
        this.projY = (this.y * this.projScale) + viewSetup.viewCenter.y
        
        this.size = mapNums(this.z, 0, viewSetup.depth, pointsSetup.maxSize, pointsSetup.minSize)
        this.alpha = mapNums(this.z, 0, viewSetup.depth, 1, 0)

    }

    move() {
        this.theta += 0.001 * viewSetup.rotHorizontal
        this.rotY += 0.001 * viewSetup.rotVertical
        this.project()
        if(pointsSetup.afterIamgeCount ) {
            if(this.afterImageSpacing >= pointsSetup.afterImageSpacing || !pointsSetup.afterImageSpacing) {
                this.#addAfterImage()
                this.afterImageSpacing = 0
            } else this.afterImageSpacing+=1
        } 
    }

    #addAfterImage() {

        this.afterImage.push(Object.copy(this))
        if(this.afterImage.length > pointsSetup.afterIamgeCount) this.afterImage.shift()
    }

    resetSpeed (sign){
        this.speed[sign] = posInt(this.originalSpeed[sign]) * (isNeg(this.speed[sign]) ? 1 : -1)
        this[sign] += isNeg(this.speed[sign]) ? -10 : 10
        this.lifeTime += 1
    }
    getColor(dim = 1) {
        const alpha = this.alpha / dim
        //log(dim, alpha, this.alpha)

        switch (viewSetup.colorMode) {
            case "monotone":
                return hsl(20,100*posInt(alpha), 100-100*posInt(alpha))
            case "shimmering":
                this.colorNum+=10
                return this.color = (this.id % 2 === 0 ? 0: 150)
            case "setByDepth":
                return hsl(100 * posInt(alpha))
            default:
                return  hsl(0, 0, 100 - 100 * posInt(alpha))
        }
    }
}


// points class
class Points {
    constructor(amount) {
        this.points = [...new Array(amount)].map((i, idx) => new Point(idx))
        this.colorScale = 360
    }
    showMovement() {
        this.points = this.points.sortAc('projScale')

        function closeToZ(a, b, r) {
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

        
        
        this.points.forEach((i, idx, arr) => {
            i.move()
            let conn = []
            let connCount = 0
            let skipLoop = false;
            let clusterSize = 0;

            const thisColor = i.getColor()


            // const thisColor = viewSetup.color ? hsl((360/pointsSetup.amount)*i.id||1, 50, 100-100*posInt(i.alpha/2)) : hsl(20,100*posInt(i.alpha), 100-100*posInt(i.alpha))
            // //viewSetup.color ? hsl(100*posInt(i.alpha)) : viewSetup.color === null ? "black" :  hsl(0,0, 100-100*posInt(i.alpha))

            if (viewSetup.mode === "points") {
                if(pointsSetup.afterIamgeCount){
                    i.afterImage.forEach((a, idxa, arr)=>{
                        point(a.projX, a.projY, (i.size/arr.length)*idxa, a.getColor((arr.length-idxa)*0.5))
                    });
                }
                point(i.projX, i.projY, i.size, thisColor) 
            }
            else if (viewSetup.mode === "id") ctx.fillText(idx, i.projX, i.projY,)
            else arr.forEach((j, jIdx) => {
                if(skipLoop) return

                const dis = closeToZ(i, j, pointsSetup.connectionDistance);
                // const clusterDis = closeToZ(i, j, pointsSetup.clusterReach);
                // if(clusterDis) clusterSize+=1

                if(clusterSize >= pointsSetup.maxClusterSize){
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
                        ctx.lineWidth = sqrt(i.alpha**2+j.alpha**2)
                        line(i.projX, i.projY, j.projX, j.projY, thisColor)


                    } else if (viewSetup.mode === "shapes" && conn.length >= 3) {
                        ctx.beginPath()
                        ctx.moveTo(i.projX, i.projY,)


                        conn.forEach(c => {
                            ctx.lineTo(c.projX, c.projY,)
                        })

                        if(viewSetup.color) ctx.fillStyle = hsl(conn.map(i=>i.color).reduce((t, i)=>t*i)/conn.length) //`#${ hex(round(conn.map(i=>i.color).reduce((t, i)=>t*i)/conn.length), 3).split(0, 8)[0] + '3F' }`
                        else {
                            ctx.fillStyle = hsl((360/20) * connCount)
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


    window.addEventListener('keydown', (e)=> {
        if(e.key === "r") {
            viewSetup.rotHorizontal = 1
            viewSetup.rotVertical = 1
        }else if(e.key === "ArrowLeft") {
            viewSetup.rotHorizontal -= 0.1
        } else if(e.key === "ArrowRight") {
            viewSetup.rotHorizontal += 0.1
        } else if(e.key === "ArrowUp") {
            viewSetup.rotVertical += 0.1
        } else if(e.key === "ArrowDown") {
            viewSetup.rotVertical -= 0.1
        } 
    })
}








ctx.invert()

// cnv.style.filter = 'invert(1) blur(1px)'
// ctx.lineWidth = 10.5
// ctx.scale(0.02, 0.02)
// ctx.translate(40000, 20000)



async function main() {
    const Pointz = new Points(pointsSetup.amount)
    setupControlls()

    async function animation() {
        clear()
        Pointz.showMovement()
        await pauseHalt()
        if(!exit) requestAnimationFrame(animation)
    }

    animation()
}


main()

