/** setup */
const packageSpeed = 200 // for smoothness needs to be similar to framerate
const packageSize = 10 
const binFomat = 16 // 16 is minimum
const activePackages = new Map()
const gs = 20
const xposs = Array(Math.floor(cnv.width / gs) + 1).fill(0).map((i, idx)=>idx*gs);

let packageSeeder = null


ctx.dark()
ctx.font = '15pt monospace';

/**
 *  goal: changing ching-signs while moving.

    how: pkg is a shape obj. the chings are the current status of the shape. 
    the active packages will be untranslated tho
    when it reaches the end, it will be the end of the shape.
    -solved!

    goal: make code that let little tickmen walk, or tunnel, or entire 'city' of rects and 
    the code is representation of curretn overveiw of the city
    -solved! 2h
 */

/** general config */
const Config = {
    depth: 1,
    zoom: {
        x: Xmid, 
        y: Ymid,
        amount: 1
    }
}

/**  pkg class as a stickman animation */
class Stickman {
    constructor(id, scale=1) {
        this.id = id
        // pkg config
        this.px = xposs.randomRange(1)[0]
        this.py = 0
        this.pkgSize = null

        this.scale = scale
        this.isOut = false

        this.y = 400
        this.x = [0, cnv.width][randint()]
        this.z = randfloat() * this.scale
        this.speed = 5 * (this.x > 0 ? randfloat(-1) : randfloat()) * (this.z*2)
        if(posInt(this.speed)<0.5) this.speed += 3

        this.status = randint(20) === 2 ? randint(20) === 1 ? "anomaly": "agent" : 'human'
        switch(this.status) {
            case "anomaly":
                this.cl = "white"
                this.speed *= 5
                this.reapear = true
                this.multyDim = randbool()
                break;
            case "agent":
                this.cl = "black"
                this.speed *= 2
                this.reapear = true
                this.multyDim = randbool()
                break;
            default:
                this.cl = 'green'
                break;
        }

        this.pkgSize = this.move().map(i=>str(i).split('').map(n=>chingConverter(n))).flat().length
        this.py = -(gs * this.pkgSize)
    }
    move() {
        // increments
        this.x += this.speed
        this.py += gs
        const z = this.z * posInt((Config.depth + this.z)/1)// * Config.depth
        if(this.multyDim) {
            this.z += (sin(this.x/50)/20)
        }

        // config setup (needs to be redone every time because of Config)
        this.legs = {
            spread: 30 * z,
            speed: 0.05 * z,
            height: 50 * z,
        }
        this.arms = {
            spread: 10 * z,
            speed: 0.05 * z,
            height: 40 * z,
            pos: 35 * z,
        }
        // legs
        const legy =  this.y+this.legs.height
        const leg1x = this.x+sin(this.x*this.legs.speed)*this.legs.spread
        const leg2x = this.x-sin(this.x*this.legs.speed)*this.legs.spread
        // arms
        const army =  this.y-this.arms.pos+this.arms.height
        const arm1x = this.x+sin(this.x*this.arms.speed)*this.arms.spread
        const arm2x = this.x-sin(this.x*this.arms.speed)*this.arms.spread

        this.bodyHeight = 50 * z +sin(this.x*this.legs.speed*2)*2 
        this.headSize= 10 * z

        if(!this.isOut) {
            ctx2.lineWidth = 5*(this.z)
            //arm back
            line2(this.x, this.y-this.arms.pos,arm2x, army, this.cl)
            // leg back
            line2(this.x, this.y,leg2x, legy, this.cl)
            //body
            line2(this.x, this.y-this.bodyHeight, this.x, this.y, this.cl)
            // leg front
            line2(this.x, this.y,leg1x, legy, this.cl)
            // arm front
            line2(this.x, this.y-this.arms.pos,arm1x, army, this.cl)
            // head
            circle2(this.x, this.y-this.bodyHeight, this.headSize, this.cl)
        } 
        const max = Xmax * (1+z)
        const mix = Ymin * (1+z)

        if(this.x > max || this.x < mix){
            if(this.reapear) {
                if(this.x > max) this.x = Xmin
                else if(this.x < mix) this.x = Xmax
            } else this.isOut = true
        }

        return [this.status, legy, leg1x, leg2x]//, army, arm1x, arm2x, this.z, this.x, this.y, this.speed, this.bodyHeight, this.headSize]
    }
}

/** seeds packages at interval */
const PackageSender = {
    getId() {
        // resycle id's. after the package length, reuse ids
        for (let [k, v] of activePackages.entries()) {
            if (v === null) return k
        }
        return activePackages.size
    },
    seedPackages() {
        if (!!packageSeeder) return
        let timeout = 0
        const seed = () => {
            if(timeout>1000) {
                this.stopSeed()
                exitting("seeder timeout")
            }
            if (exit) return this.stopSeed()
            if (pause || !window.isFocussed()) return timeout++

            timeout = 0
            const id = this.getId()
            activePackages.set(id, new Stickman(id))
        }
        packageSeeder = setInterval(seed, packageSpeed)
    },
    stopSeed() {
        window.clearInterval(packageSeeder)
        packageSeeder = null
    }
}

/** converts str to symbol */
function chingConverter(str, encode = true) {
    const ching = 20000
    const codepoint = str.codePointAt(0) + (encode ? ching : -ching)
    return String.fromCodePoint(codepoint)
}

/** main visual animation */
function matrix() {
    shade()
    shade2()
    const sorted = [...activePackages].filter(i=>i[1]).sort((a, b)=> a[1].z - b[1].z)
    for(let [k, v] of sorted) {
        if(!v) continue
        const stats = v.move()
        // converts all values into an array of chings and flattens that into a ching line
        const chings = stats.map(i=>str(i).split('')).flat().circumcise(v.pkgSize, "0").map(n=>chingConverter(n))

        chings.forEach((w, idx, arr) => {
            const vt = v.status
            const c = v.isOut? 0 : vt === "human" ? 120 : (vt==='agent'? 80: 200)
            ctx.fillStyle = hsl(c, 50, ((100 / arr.length) * idx))
            ctx.fillText(w, v.px, v.py + (gs * idx));
        })
        if(v.py+v.pkgSize>Ymax) activePackages.set(k, null)
    }
}

/** recursive animation */
async function animate() {
    //clear()
    rect(Xmin, Ymin, Xmax, Ymax, grd, "#0005005f")

    clear2()
    var grd = ctx.createLinearGradient(0, 0, 0, 600);
    grd.addColorStop(0, "#0009");
    grd.addColorStop(1, "#fff9");
    rect2(Xmin, Ymin, Xmax, Ymax, grd)

    matrix()
    await sleep()
    await pauseHalt()
    if(!exit) requestAnimationFrame(animate)
}

/** init function */
const init = async () => {
    function showZoom() {
        ctx2.resetTransform(); // You need to make sure to include this
        // Keep in mind though, resetTransform doesn't exist in some browsers, you may want to use setTransform instead
        ctx2.translate(Config.zoom.x, Config.zoom.y);
        ctx2.scale(Config.zoom.amount, Config.zoom.amount);
        ctx2.translate(-cnv.width / 2, -cnv.height / 2);
    }

    Events.setKey("r", () => window.location.reload())
    Events.setKey("d", () => (Config.depth += 0.01))

    Events.setKey("ArrowUp", () => {
        Config.zoom.amount+=0.01
        showZoom()
    })
    Events.setKey("ArrowDown", () => {
        Config.zoom.amount-=0.01
        showZoom()
    })
    Events.setKey("ArrowLeft", () => {
        Config.zoom.x-=1
        showZoom()
    })
    Events.setKey("ArrowRight", () => {
        Config.zoom.x+=1
        showZoom()
    })

    animate()
    PackageSender.seedPackages()
}

init()