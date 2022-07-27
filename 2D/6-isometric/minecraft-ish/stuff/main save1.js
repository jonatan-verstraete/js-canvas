class Grid {
    constructor(){
        this.grid = []
    }
    #setup() {
        const {df, sx, sy}= noiseEff
        gridMap.clear()

        for(let y=0; y<gridSize.y; y++) {
            for(let x=0; x<gridSize.x; x++) {
                const rv = Math.round(((1 + noise.perlin3(x/df, y/df, zoff)) / 2) * gridSize.z)

                for(let z=0; z<rv;z++) {
                    const res = new Cube(x, y, z, rv)
                    res.mat = material.getByVal(rv*(360/gridSize.z))
                    gridMap.set(nameConvert(x, y, z), res)
                }
            }
        }
    }
    #layer1() {
        [...gridMap.values()].forEach((i)=> {
            i.draw()
        });
    }
    draw() {
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
  //ctx.scale(0.8, 0.8)
  //grid.generate()
    //ctx.clearRect(-Xmax, -Ymax, Xmax, Ymax)
    window.onclick = ()=> {pause = true}

let seed= 5
  const animate = async() => {
    noise.seed(12)
    log('seed', seed)
    seed++

    clear()

    ctx.translate(spX, spY)

    grid.generate()
    grid.draw()

    ctx.translate(-spX, -spY)
    zoff+= 0.05
    await pauseHalt()
    await sleep(0.5)
    //requestAnimationFrame(animate)
  }
  animate()
}


const material = new Material()
const grid = new Grid()

ctx.background('#111')
window.onload = ()=> main()





/*
TODO real-time:
- DONE* fix shes/light on blocks related to lighting
  * Z not working

TODO
- put all vars in changeable state/object: settings = {...}

TODO background:
- roation around own axis using arrows
- fix materals e.g. all type of rock




*/