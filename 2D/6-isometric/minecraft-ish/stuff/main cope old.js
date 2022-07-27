class Grid {
    constructor(){
        this.rawGrid = []
        this.rawValues = []
        this.grid = []
    }
    #setup() {
        const {df, sx:nScalex, sy:nScaley, ex: nEffx, ey: nEffy}= noiseEff

        // get noise values, need to do this first in order to scale the noise later
        for(let z=0; z<gridSize.z; z++) {
            for(let y=0; y<gridSize.y; y++) {
                for(let x=0; x<gridSize.x; x++) {

                    const value = toFixed(noise.perlin3(x/df, y/df,  z/df) *  10000)
                    this.rawValues.push(value)
                }
            }
        }
        // to scale numbers to a 360 scale
        const low = this.rawValues.sortDc()[0]
        const high = this.rawValues.sortAc()[0]


        for(let z=0; z<gridSize.z; z++) {
            for(let y=0; y<gridSize.y; y++) {
                for(let x=0; x<gridSize.x; x++) {

                    const rv = this.rawValues.next()
                    const val = scaleNum(rv, low, high, 0, 360)
                    const res = new Cube(x, y, z, val)

                    res.v = val
                    res.mat = material.getByVal(val)
                    gridMap.set(nameConvert(x, y, z), res)
                }
            }
        }
    }
    draw() {
        // [...gridMap.values()].forEach((i)=> {
        //     let {x, y, v} = i
        //     x *= tileWidth
        //     y *= tileHeight

        //    // v =( 360/this.highestVal) * v

        //     square(x, y, tileWidth, "blue", hsl(v))

        //     ctx.fillStyle = "white"
        //     ctx.fillText(str(v), x+tileWidth/2, y+tileWidth/2)
        // });

        //


        [...gridMap.values()].forEach((i)=> {
            i.draw()
        });
    }

    generate() {
        this.#setup()
    }
}


function drawBLock(pt) {
  const {projx:x, projy:y, projz:z, v, mat:cl} = pt
  const glv = 50


  const top = hsl(cl.v, cl.s, glv, cl.a),
  bottom = hsl(cl.v, cl.s, glv*0.1, cl.a),
  left = hsl(cl.v, cl.s, glv*0.6, cl.a),
  right = hsl(cl.v, cl.s, glv*0.8, cl.a);
  const th = tileHeight
  let zileHeight = (z * th)
  ctx.save()
  ctx.translate((x-y) * tileWidth/2, (x+y) * th/2)
    
  const topy = (th/2-zileHeight) 
  // bottom
  ctx.fillStyle = bottom
  ctx.beginPath()
  ctx.moveTo(0, topy+th/2)
  ctx.lineTo(tileWidth/2, topy+th)
  ctx.lineTo(0, topy+th*1.5)
  ctx.lineTo(-tileWidth/2, topy+th)
  ctx.closePath()
  ctx.fill()

  // top
  ctx.fillStyle = top
  ctx.beginPath()
  ctx.moveTo(0, -zileHeight)
  ctx.lineTo(tileWidth/2, topy)
  ctx.lineTo(0, th-zileHeight)
  ctx.lineTo(-tileWidth/2, topy)
  ctx.closePath()
  ctx.fill()
  // left

  ctx.fillStyle = left

  ctx.beginPath()
  ctx.moveTo(-tileWidth/2, topy)
  ctx.lineTo(0, th-zileHeight)
  ctx.lineTo(0, th-zileHeight+th)
  ctx.lineTo(-tileWidth/2, topy+th)
  ctx.closePath()
  ctx.fill()

  // left
  ctx.fillStyle = right
  ctx.beginPath()
  ctx.moveTo(tileWidth/2, topy)
  ctx.lineTo(0, th-zileHeight)
  ctx.lineTo(0, th-zileHeight+th)
  ctx.lineTo(tileWidth/2, th/2-zileHeight+th)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}


const main = ()=> {
  const grid = new Grid()
  grid.generate()

  const animate = async() => {
    clear()
    ctx.translate(spX, spY)


    grid.draw()
    ctx.translate(-spX, -spY)
    await pauseHalt()
    await sleep(.1)
    //requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)
}
noise.seed(randint(990909))
const material = new Material()
ctx.background('#111')
window.onload = ()=> main()




/*
TODO real-time:
- DONE* fix shes/light on blocks related to lighting
  * Z not working

TODO interacive:
- fix that water is all empty spaces
- fix that empty spaces are with more => form a tunnel

TODO background:
- roation around own axis using arrows
- fix materals e.g. all type of rock




*/