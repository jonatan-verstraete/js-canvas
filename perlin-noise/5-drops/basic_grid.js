const drops = []
let dropamt = 50
const gridDetail = 3
const grid = []


const noiseSetup = {
    df: 500,
    zoff: 1,
    scale: 1,
    off() {
        this.zoff += 0.005
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
        line(x, y, x+v.x, y+v.y, "black")
    }
}



 
async function main() {
   // ctx.invert()
    for(let x of range(Xmax)) {
        for(let y of range(Ymax)) {
            if(x%gridDetail==0 && y%gridDetail==0) grid.push(new GridPoint(x, y))
        }
    }

    async function animation() {
        clear()
        for(let i of grid) i.draw()
        noiseSetup.off()

        await pauseHalt()
       if(!exit) requestAnimationFrame(animation)
    }

    animation()
}

main()