class Drop {
    constructor() {
        const x = random(width)

        this.speed = (random(4) + 0.1)/200
        this.pos = createVector(x, random(height))
        //this.targ = createVector(x+random(10), height)
        this.lastPos = createVector(x, 0)

        this.depth = 1
        this.color = map(drops.length, 0, dropamt, 10, 100)//COLORS.next()
        this.thickness = 0.1
    }
    draw() {
        if(this.pos.y>height+10) {
            drops.remove(this)
            return
        }
        const depth = (1+sin(this.speed))/1000
        this.thickness += posInt(noise(this.thickness))/100
        // const { x, y } = posTowards(this.lastPos, this.pos, this.speed)
        // this.lastPos.x = this.pos.x
        // this.lastPos.y = this.pos.y
        this.pos.x += depth
        this.pos.y += depth

        strokeWeight((posInt(sin(this.thickness))+depth)*20);
        //stroke(this.color)
        point(noise(this.pos.x)*width, sin(noise(this.pos.y))*height)
        //line(this.lastPos.x, this.lastPos.y, this.pos.x, this.pos.y)
    }
}


const drops = []
let dropamt = 5

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
}

function draw() {
    if(drops.length<dropamt)drops.push(new Drop())
    fill('#ffffff0f');
    rect(0, 0, width, height)
    drops.forEach(i=>i.draw())
}