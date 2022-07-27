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
        this.zoff += 0.01
    }
}



class GridPoint {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    draw() {
        const {x, y} = this
        const {df, zoff, scale:noiseScale} = noiseSetup
        let value = noise.perlin3(x/df,  y/df,  zoff)
            
        const angle = ((1 + value) * 1.1 * 128) / (PI * 2)
        const v = rotateVector(x * noiseScale, y, angle)
        line(x, y, x+v.x, y+v.y, "#666")
    }
}

class Drop {
    constructor() {
        this.speed = (randint(10) + 0.1)/1
        this.x = randint(Xmax)
        this.y = -20
        this.lastPos = {}
        this.shades = []
        this.shadeSize = 10
        this.width = this.speed * 10 //randfloat(5)
        this.color = 0
    }
    draw() {
        const {x, y, width, shades, shadeSize} = this
        const {df, zoff, scale:noiseScale} = noiseSetup
        this.y += this.speed

        if(y>Ymax+10) {
            drops.remove(this)
            drops.push(new Drop())
            return
        }

        let value = noise.perlin3(x/df,  y/df,  zoff)
        const angle = ((1 + value) * 1.1 * 128) / (PI * 2)
        const v = rotateVector(x * noiseScale, y, angle)

        // shades.unshift({x:x+v.x, y:y+v.y})
        // if(shades.length>shadeSize) {
        //     shades.pop()
        // } else return

        //ctx.lineWidth = width
        // for(let i=0;i<=shades.length-2; i++) {
        //     const a = shades[i]
        //     const b = shades[i+1]
        //     line(a.x, a.y, b.x, b.y, "black")
        // }
        // const p = shades.last()
        // line(x+v.x, y+v.y, p.x, p.y, "red")
        point(x+v.x, y+v.y, width, hsl(this.color+gloablColor))
        this.color += 0.1
    }
}


 
async function main() {
    ctx.invert()
    for(let x of range(Xmax)) {
        for(let y of range(Ymax)) {
            if(x%gridDetail==0 && y%gridDetail==0) grid.push(new GridPoint(x, y))
        }
    }


    async function animation() {
        rect(0, 0, Xmax, Ymax, null, "#ffffff08")
        //clear()

        if(drops.length<dropamt) drops.push(new Drop())
        //for(let i of grid) i.draw()
        for(let i of drops) i.draw()
        // fillText("B", Xmid-500, Ymid+200, "#0008", 300)
        // fillText("lanc", Xmid-320, Ymid+200, "#0008", 150)


        noiseSetup.off()
        gloablColor = overcount(gloablColor+.1, 360)

        await pauseHalt()
       if(!exit) requestAnimationFrame(animation)
    }

    animation()
}

main()