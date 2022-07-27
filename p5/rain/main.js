const drops = []
let dropamt = 50
const gridDetail = 15
const grid = []


const noiseSetup = {
    df: 2000,
    zoff: 1,
    scale: 10,
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
        let value = noise(x/df,  y/df,  zoff)
            
        const angle = ((1 + value) * 1.1 * 128) / (PI * 2)
        const v = rotateVector(x * noiseScale, y, angle)
        line(x, y, x+v.x, y+v.y)
    }
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    for(let x of range(width)) {
        for(let y of range(height)) {
            if(x%gridDetail==0 && y%gridDetail==0) grid.push(new GridPoint(x, y))
        }
    }
}

function draw() {
    clear()
    for(let i of grid) i.draw()
    noiseSetup.off()
}