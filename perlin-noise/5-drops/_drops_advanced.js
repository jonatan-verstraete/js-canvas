const drops = []
let dropamt = 5000
const gridDetail = 20
const grid = []
let gloablColor = 0


const noiseSetup = {
    df: 500,
    zoff: 1,
    scale: 1,
    off() {
        this.zoff += 0.002
    }
}


class All {
    constructor(yourPurposeInLife = "lost"){
        this.purposeInLife = yourPurposeInLife

    }
    getNoise(x, y, z) {
        const {df, zoff, scale:noiseScale} = noiseSetup
        let value = noise.perlin3(x/df,  y/df,  zoff)
            
        const angle = ((1 + value) * 1.1 * 128) / (PI * 2)
        return rotateVector(x * noiseScale, y, angle)

    }
}

class Grid extends All {
    constructor() {
        super("be in balance")
        this.points = []
        for(let x of range(Xmax)) {
            for(let y of range(Ymax)) {
                if(x%gridDetail==0 && y%gridDetail==0) this.points.push({x:x, y:y})
            }
        }
    }
    draw() {
        for(let p of this.points) {
            const {x, y} = p
            const v = this.getNoise(x, y)
            line(x, y, x+v.x, y+v.y, "#666")
        }
    }
}


class Drop extends All {
    constructor() {
        super("to flower")
        this.speed = (randint(10) + 0.1)/20
        this.x = randint(Xmax)
        this.y = -20

        this.width = this.speed * 10
        this.color = 0
    }
    draw() {
        const {x, y, width} = this
        this.y += this.speed

        if(y>Ymax+10) {
            drops.remove(this)
            drops.push(new Drop())
            return
        }
        const v = this.getNoise(x, y)

        circle(x+v.x, y+v.y, width, hsl(this.color+gloablColor))
        this.color += 0.1
    }
}


 
async function main() {
    ctx.invert()
    //ctx.globalCompositeOperation = "multiply"
    ctx.globalAlpha = 0.433
    const grid = new Grid()


    async function animation() {
        rect(0, 0, Xmax, Ymax, null, "#ffffff08")
        //grid.draw()


        if(drops.length<dropamt) drops.push(new Drop())
        for(let i of drops) i.draw()



        noiseSetup.off()
        gloablColor = overcount(gloablColor+.1, 360)

        await pauseHalt()
       if(!exit) requestAnimationFrame(animation)
    }

    animation()
}

main()