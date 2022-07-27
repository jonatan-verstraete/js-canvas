/** setup */
const packageSpeed = 200 // for smoothness needs to be similar to framerate
const packageSize = 10 
const binFomat = 16 // 16 is minimum
const gs = 20
const xposs = Array(Math.floor(cnv.width / gs) + 1).fill(0).map((i, idx)=>idx*gs);
let packageSeeder = null
//ctx.dark()

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
        this.scale = scale
        this.isOut = false

        this.y = 400
        this.x = [0, cnv.width][randint()]
        this.z = randfloat() * this.scale
        this.speed = 5 * (this.x > 0 ? randfloat(-1) : randfloat()) * (this.z*2)
        this.reapear = true
        this.cl = "f00"
    }
    move() {
        // increments
        this.x += this.speed
        const z = this.z * posInt((Config.depth + this.z)/1)// * Config.depth
        if(this.multyDim) {
            this.z += (sin(this.x/50)/20)
        }

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
        this.headSize= 20 * z

        if(!this.isOut) {
            ctx.lineWidth = 8*(this.z)
            //arm back
            line(this.x, this.y-this.arms.pos,arm2x, army, this.cl)
            // leg back
            line(this.x, this.y,leg2x, legy, this.cl)
            //body
            line(this.x, this.y-this.bodyHeight, this.x, this.y, this.cl)
            // leg front
            line(this.x, this.y,leg1x, legy, this.cl)
            // arm front
            line(this.x, this.y-this.arms.pos,arm1x, army, this.cl)
            // head
            point(this.x, (this.y-this.bodyHeight), this.headSize, this.cl)
        } 
        const max = Xmax * (1+z)
        const mix = Ymin * (1+z)

        if(this.x > max || this.x < mix){
            if(this.reapear) {
                if(this.x > max) this.x = Xmin
                else if(this.x < mix) this.x = Xmax
            } else this.isOut = true
        }
    }
}



async function animate() {
    clear()
    var grd = ctx.createLinearGradient(0, 0, 0, 600);
    grd.addColorStop(0, "#0009");
    grd.addColorStop(1, "#fff9");
    rect(Xmin, Ymin, Xmax, Ymax, grd)

    shade()
    const sorted = [...activePackages].filter(i=>i).sort((a, b)=> a.z - b.z)
    for(let v of sorted) {

        v.move()
    }

    await sleep()
    await pauseHalt()
    if(!exit) requestAnimationFrame(animate)
}

const activePackages = range(50).map(i=>new Stickman())

const init = async () => {
    Events.setKey("r", () => window.location.reload())
    Events.setKey("d", () => (Config.depth += 0.01))
    animate()
}

init()