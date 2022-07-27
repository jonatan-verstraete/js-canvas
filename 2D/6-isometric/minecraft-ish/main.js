class Grid {
    constructor(){
        this.grid0 = []
        this.grid1 = []

    }
    #setup() {
        gridMap.clear()
        this.grid0 = this.#layer0()
        //this.grid1 = this.#layer1()
    }

    #layer0() {
        const {df, df2}= noiseEff
        const zheight = gridSize.z
        for(let y=0; y<gridSize.y; y++) {
            for(let x=0; x<gridSize.x; x++) {
                const perlVal = ((1 + noise.perlin3(x/df, y/df, zoff)) / 2) * zheight
                // continentalness (high steep mountains)
                const CON = material.continentalness(perlVal, zheight)
                // peaks & valleys (high contrast)
                const PV = ((1 + noise.perlin3(x/(df/2), y/(df/2), zoff)) / 2) * zheight
                // erosion (wide speader area), low df
                const ERO = ((1 + noise.perlin3(x/(df*2), y/(df*2), zoff)) / 2) * zheight

                const rv = Math.round( (PV+ERO+CON)/3 )
                const res = new Cube(x, y, rv, rv)
                res.mat = material.getByVal(rv*(360/zheight))

                // filling the complete horizontal reach of every x,y
                for(let z=0; z<zheight;z++) {
                    let val = 240
                    let type = null
                    if(z > rv && z > terrain.waterlevel) {
                        type = 'air'
                    } else if(z === rv) {
                        gridMap.set(nameConvert(x, y, rv), res)
                        continue
                    } else if( z > rv && z <= terrain.waterlevel) {
                        // under sealevel
                        if(res.mat.type === material.water.type) val = 0
                    } 
                    //log(val, isair)
                    const n = new Cube(x, y, z, val)
                    n.mat = material.getByVal(val, type)
                    gridMap.set(nameConvert(x, y, z), n)
                }
            }
        }
    }

    draw() {
        [...gridMap.values()].forEach((i)=> i.draw() );
    }

    generate() {
        this.#setup()
    }
}


function drawBLock(pt) {
  const {projx:x, projy:y, projz:z, v, mat:cl} = pt


  const lightDis = distanceToZ({x:x*tileWidth, y:y*tileHeight, z:z*(tileHeight+tileWidth)/2}, lighting)/10
  // global light value
  const glv = cl.type === 'air'? cl.l : (((lightDis*((z))*lighting.l)/gridSize.tile) * cl.l)/50
  //const glv = cl.l

  const top = hsl(cl.v, cl.s, glv, cl.a),
  bottom = hsl(cl.v, cl.s, glv*0.1, cl.a),
  left = hsl(cl.v, cl.s, glv*0.6, cl.a),
  right = hsl(cl.v, cl.s, glv*0.8, cl.a);
  const th = tileHeight
  let zileHeight = (z + (cl.type === material.water.type? 0.5 : 0)) * th

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
    noise.seed(12)
    ctx.background('#111')
    //ctx.scale(0.8, 0.8)
    //grid.generate()
    //ctx.clearRect(-Xmax, -Ymax, Xmax, Ymax)
    window.onclick = ()=> {pause = true}
    zoff = 1

  const animate = async() => {
    clear()

    ctx.translate(spX, spY)
    zoff += 0.01

    grid.generate()
    grid.draw()

    ctx.translate(-spX, -spY)
    zoff+= 0.05
    await pauseHalt()
    await sleep(0.5)
    // requestAnimationFrame(animate)
  }
  animate()
}

const material = new Material()
const grid = new Grid()

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