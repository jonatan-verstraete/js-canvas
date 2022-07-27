const 
rows =  30,
cols = 30,
useSquares = true;

const 
rawWidth = ceil(cnv.clientWidth/rows),
rawHeight = ceil(cnv.clientHeight/cols);

const 
tileHeight = useSquares ? (rawWidth > rawHeight ? rawWidth : rawHeight) : rawHeight,
tileWidth = useSquares ? (rawHeight > rawWidth ? rawHeight : rawWidth) : rawWidth ;



ctx.lineWidth = 1
ctx.background('#333')
let transX = 0, transY = 0;

class Grid {
    constructor() {
        this.grid = []
    }
    generate() {
        this.grid = []
        function getRandomDir(x, y,stroke = '#fff') {
            const rand = randint(3)
            // top
            if(rand === 0) return {x1: x, y1: y, x2:x+tileWidth, y2: y, stroke: stroke}
            // bottom
            else if(rand === 1) return {x1: x, y1: y+tileHeight, x2:x+tileWidth, y2: y+tileHeight, stroke: stroke}
            // left
            else if(rand === 2) return {x1: x, y1: y, x2:x, y2: y+tileHeight, stroke: stroke}
            // bottom
            else if(rand === 3) return {x1: x+tileWidth, y1:  y,  x2: x+tileWidth,  y2: y+tileHeight, stroke: stroke}
        }
        for(let col of range(cols)) {
            const r = []
            for(let row of range(rows)) {
                r.push({...getRandomDir((row*tileWidth)+transX, (col*tileHeight)+transY), checkedSides: new Set()})
            }
            this.grid.push(r)
        }
    }
    show() {
        for(let col of range(cols)) {
            for(let row of range(rows)) {
                const c = this.grid[col][row]
                line(c.x1, c.y1, c.x2, c.y2, c.stroke)
            }
        }
    }
    async makePath() {
        let cp = {x:0,y:0}
        let done = false
        let cdir = {x:0,y:0}
        let current = this.grid[cp.y + cdir.y][cp.x + cdir.x]
        const deadEnds = []
        const checked = []
        try{


        while(!done) {
            await sleep(0.1)
            await pauseHalt()
            square(current.x1, current.y1,  tileWidth, "red", "red")
            cdir = {x:0, y:0}


            // if(current.x1 === Xmax-tileWidth && current.y1 === Ymax-tileHeight ) {
            //     done = true
            //     log('DONE')
            //     textCenter('DONE !!! ')
            //     return
            // } else log(current.x1, current.y1)
            
            if(current.checkedSides.size >= 3){
                if(checked.length) {
                    log(current)
                    return console.warn('NO CURRENT anymore')
                }
                current = checked.pop()
                log('-- going to last position', current)


            }

            const cs = current.checkedSides
            const newDir = randint(3)
            // right
            if(newDir === 0 && !cs.has('r')) {
                current.checkedSides.add('r')
                cdir.x += 1
            // left
            } else if(newDir === 1 && !cs.has('l')) {
                current.checkedSides.add('l')
                cdir.x -= 1
            // bottom
            } else if(newDir === 2 && !cs.has('b')) {
                current.checkedSides.add('b')
                cdir.y += 1
            // top
            } else if(newDir === 3 && !cs.has('t')) {
                current.checkedSides.add('t')
                cdir.y -= 1
            } else {
                log('-- 000', cs.size)
                continue
            }

            if(cdir.y < 0 || cdir.y >= cols) {
                log('-- 001')
                continue
            }
            if(cdir.x < 0 || cdir.x >= rows) {
                log('-- 002')
                continue
            }

            cp.x += cdir.x
            cp.y += cdir.y

            if(cp.y>cols) cp.y = cols-1
            else if(cp.y<0) cp.y = 1

            if(cp.x>rows) cp.x = rows-1
            else if(cp.y<0) cp.x = 1


            square(current.x1, current.y1,  tileWidth, "pink", "#F9f8faf")
            ctx.fillStyle = "blue"

            const targ = this.grid[cp.y][cp.x]
            if(current.checkedSides.size >= 3 ) continue
            else {
                current = targ
                checked.push(current)
            }
        }
    }catch(e) {
        log(e)
        log(current, cp)
    }
    }
}


const grid = new Grid()


async function fade(speed = 20, time = 0.01, {col = 0, sat = 0, light = 0}={}) {
    const s = 1/speed
    for(let i =0; i< 1; i+= s/2) {
        rect(Xmin, Ymin, Xmax, Ymax, null, hsl(col, sat, light, s*2))
        await sleep(time)
    }
    rect(Xmin, Ymin, Xmax, Ymax, null, hsl(col, sat, light))
}


async function animate() {
    await fade()
    grid.generate()
    grid.show()

    // await grid.makePath()
    // await sleep(1)
    // await pauseHalt()
    // requestAnimationFrame(animate)
}

animate()
