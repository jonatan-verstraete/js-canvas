const tileWidth= 60,   
tileHeight= 30,
gridSize= 24,
// the resuduel.. sometinhg.. of inital colors are generated. def 2
initColCount= 2,
// count fo diamon algorithm usage (sort of rawness or contrast), min 1. def 2
terrainIterations= 2,
// the value of which numbers inherit from other numbers by diamon algorithm (that handles contrast DO NOT CHANGE THIS. def 0.01)
terrainInheritCount= 0.01,
// the reach (only border points, not really reach) of diamond structure. def 1
terrainSpread= 1,
// 0-n is how much floats are used. def 0
terrainHumanize= 1,
// the hihgest number could be assigned to key points, it's scaled so doenst matter what value. def 360
generationMaxValue=  360,
// lighting, position and (not actually) lightness. def {* * 3 1}
lighting= {
  x: 50, 
  y: -30,
  z: 3,
  l: 2,
};

/** UI interactive variables */
// the current posisiton of the map
let spX = Xmax/2,
spY = 450;

let gThetaX = 0
let gThetaY = 0
let gThetaZ = 0

// set theta to this number, will the amount of rotation
const gThetaInc = 0.08
// devides the theta each frame by this number
const gThetaDec = 1.1
const gridMap = new Map()
const material = new Material()
const seeder = new NumSeeder(randint(999999))//423820
ctx.background('#111')


window.onkeydown = (e)=> {
  if(pause) return
  const ev = e.key
  if(ev === 'ArrowLeft') {
    gThetaX += gThetaInc
  } else if(ev === 'ArrowRight') {
    gThetaX -= gThetaInc
  } else if(ev === 'ArrowDown') {
    gThetaY += gThetaInc
  } else if(ev === 'ArrowUp') {
    gThetaY -= gThetaInc
  }
}





class Cube {
  constructor(x, y, z, v){
    this.x = x
    this.y = y
    this.z = z 
    this.v = v

    this.projx = x
    this.projy = y
    this.projz = z
    this.mat = null
  }
  project() {
    // project point in space
    if(gThetaY != 0) {
      const {x, y, z} = rotateY(this.x, this.y, this.z)
      this.projx = x
      this.projy = y
      this.projz = z
    }
    if(gThetaX != 0) {
      const {x, y, z} = rotateX(this.x, this.y, this.z)
      this.projx = x
      this.projy = y
      this.projz = z
    }
  }
  draw() {
    drawBLock(this)
  }
} 

class Grid {
  #setup() {
    for(let z=0; z<gridSize; z++) {
      for(let y=0; y<gridSize; y++)  {
        for(let x=0; x<gridSize; x++) {
          const val = (y%initColCount===0 && x%initColCount===0 && z%initColCount===0) ? seeder.get()*generationMaxValue : 0
          gridMap.set(nameConvert(x, y, z), {x:x, y:y, z:z, mat: {}, v: val})
        }
      }
    }
  }

  /** getst he average vale of all serrounding fields (at a certain distance) */
  #calcualteNeighbours(x, y, z) {
    const r = terrainSpread;
    const dir = [
      // layer top
      [
        [x-r, y-r, z-1], [x, y-r, z-1], [x+r, y-r, z-1],
        [x-r, y  , z-1], [x, y,   z-1], [x+r, y  , z-1],
        [x-r, y+r, z-1], [x, y+r, z-1], [x+r, y+r, z-1],
      ],
      // layer
      [
        [x-r, y-r, z], [x, y-r, z], [x+r, y-r, z],
        [x-r, y  , z],              [x+r, y  , z],
        [x-r, y+r, z], [x, y+r, z], [x+r, y+r, z],
      ],
      // layer bottom
      [
        [x-r, y-r, z+1], [x, y-r, z+1], [x+r, y-r, z+1],
        [x-r, y  , z+1], [x, y,   z+1], [x+r, y  , z+1],
        [x-r, y+r, z+1], [x, y+r, z+1], [x+r, y+r, z+1],
      ]
    ];
    let sum = 0
    let count = 0
    let isFloating = false
    const neighbours = []
    for(let layer of dir) {
      for(let i of layer) {
        if(i.filter((n)=>n>=0 && n < gridSize).length === i.length) {
          const c = gridMap.get(nameConvert(...i))
          neighbours.push(c)
          sum += c.v
          count+= c.v===0 ? terrainInheritCount : 1
        }
      }
    }
    // !!!  check if its a floating block or has only n horizontal support block

    return {val: round(sum/count), bottom: dir[2][4]}
  }

  /** main diamond function (own version) */
  diamond(iterations = terrainIterations) {
    loopi:
    for(let i = 0; i < iterations; i++) {
      loopz:
      for(let pz=0; pz<gridSize; pz++) {
        loopy:
        for(let py=0; py<gridSize; py++) {
          loopx:
          for(let px=0; px<gridSize; px++) {

            const id = nameConvert(px, py, pz)
            const {val, bottom} = this.#calcualteNeighbours(px, py, pz)

            // final iteration
            if(i === iterations-1) {
              const res = new Cube(px, py, pz, val)
              res.mat = material.getByVal(val)
              let air = (pz >= 1 && material.grass.type != res.mat.type)


              // (others.filter(i=>i.mat.type===material.air.type).length >= others.length-1)
              // if(gridMap.has(nameConvert(...bottom)) && gridMap.get(nameConvert(...bottom)).mat.type==material.air.type) {
              //   air = true
              // } else {
              //   log(bottom, gridMap.get(nameConvert(...bottom)))
              // }

              if(air) {
                res.v = 0
                res.mat = material.getByVal(0, {air: true})
              }
              gridMap.set(id, res)

            } else {
              gridMap.set(id, {...gridMap.get(id), x:px, y:py, z:pz, v:val, mat: {}})
            }

          }
        }
      }
    }
  }

  draw() {
    // smooth rotation, normalize theta at 0.1
    if(gThetaX != 0) gThetaX = toFixed(gThetaX/gThetaDec, 2);
    if(gThetaY != 0) gThetaY = toFixed(gThetaY/gThetaDec, 2);

    
    [...gridMap.values()].forEach((i)=> {
      i.draw()
    });

    // [...gridMap.values()].forEach((i)=> {
    //   ctx.fillStyle = 'red'
    //   ctx.fillText(str(toFixed(i.val)), i.projx*tileWidth, i.projy*tileHeight)
    // })
  }

  generate() {
    this.#setup()
    this.diamond()
  }
}


function drawBLock(pt) {
  const {projx:x, projy:y, projz:z, v, mat:cl} = pt
  
  // const d =  gridSize/3
  // if(x>d && y>d && z>d  &&  x<10 && y<10 && z<900 ) return

  //const lightDis = distanceToZ({x:x*tileWidth, y:y*tileHeight, z:z*(tileHeight+tileWidth)/2}, lighting)
  // global light value
  const glv = 50//(lightDis*((z)/20)*lighting.l)/gridSize

  //markPoint(lighting.x, lighting.y, 50, {txt: str("no z")})




  const top = hsl(cl.v, cl.s, glv, cl.a),
  bottom = hsl(cl.v, cl.s, glv*0.1, cl.a),
  left = hsl(cl.v, cl.s, glv*0.6, cl.a),
  right = hsl(cl.v, cl.s, glv*0.8, cl.a);

  const th = tileHeight
  let zileHeight = (z * th) - (cl.type === 'water' ? 10 : 0)

  // adds 1 as 0 is flat
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



const main= ()=> {
  const grid = new Grid()
  grid.generate()
  let c = 0

  const animate = async() => {
    clear()
    ctx.translate(spX, spY)
    // if(c%3===0)grid.addColor()
    // grid.diamond()



    grid.draw()
    ctx.translate(-spX, -spY)
    await pauseHalt()
    await sleep(.1)
    //requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)
}

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