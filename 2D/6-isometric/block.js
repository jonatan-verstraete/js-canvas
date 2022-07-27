/**
 * isometric terrain generation
 * sources:
 * - isometric (fully implemented with added bottom surface for water/-y surfaces) && part II of the videos: https://www.youtube.com/watch?v=go1qrWFw_bs
 * - terrain generation (only read the first part and made my own thing of the diamond concept): https://yonatankra.com/how-to-create-terrain-and-heightmaps-using-the-diamond-square-algorithm-in-javascript/
 */
const tileWidth= 60,   
tileHeight= 30,
gridSize= 14,
// the resuduel.. sometinhg.. of inital colors are generated. def 2
initColCount= 2,
// count fo diamon algorithm usage (sort of rawness or contrast). def 2
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




class Seeder {
  constructor(seed = 0, ) {
    this.s = seed
    this.inc = 0 //randint(10000)
    log('-- seeding:', seed)
  }
  get() { // mulberry32 // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    //this.inc++
    // return str((posInt(tan(this.inc))))[4]
    let t = this.s += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  } 
}


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

const material = {
    grass: hsl(120, 50, 20, 1, true),
    rock: hsl(60, 20, 10, 1, true),
    earth: hsl(45, 50, 15, 1, true),
    sand: hsl(40, 40, 35, 1, true),
    white: hsl(0, 0, 50, 1, true),
    black: hsl(0, 0, 0, 1, true),

    // assigns color by hsl value
    hslConverter(val) {

      return hsl(val, 50, 50, val > 180 ? 0 : 1, true)
      val = overcount(val, 360)
      if(val > 180) return hsl(220, 50, 60, 0, true)
      if(val > 170) return this.sand
      if(val > 150) return this.grass
      if(val > 100) return this.earth
      if(val > 60) return this.rock
      if(val > 30)  return this.black
      return this.white
    },

}



function rotateX(x, y, z, theta=gThetaX) {
  const X = x
  const Y = y*cos(theta) - z*sin(theta)
  const Z = y*sin(theta) + z*cos(theta)
  return {x:X, y:Y, z:Z}
}

function rotateY(x, y, z, theta=gThetaY) {
  const Y = y
  const X = x*cos(theta) + z*sin(theta)
  const Z = z*cos(theta) + x*sin(theta)
  return {x:X, y:Y, z:Z}
}

function rotateZ(x, y, z, theta=gThetaZ) {
  const X = x*cos(theta) - y*sin(theta)
  const Y = x*sin(theta) + y*cos(theta)
  const Z = z
  return {x:X, y:Y, z:Z}
}



class Cube {
  constructor(x, y, z, v, isIni){
    this.x = x
    this.y = y
    this.z = z 
    this.v = v
    this.isIni = isIni

    this.projx = x
    this.projy = y
    this.projz = z
    this.cl = hsl(60, 0, 20, 1, true)
    this.depth = sqrt(this.x**2 + this.y**2 + this.z**2)
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
    this.depth = sqrt(this.x**2 + this.y**2 + this.z**2)
  }
  draw() {
    drawBLock(this)
  }

} 
class Grid {
  constructor() {
    this.grid = []
    this.flatGrid = []
  }
  #setup() {
    this.grid = []
    for(let z=0; z<gridSize; z++) {
      const sliceY = []
      for(let y=0; y<gridSize; y++)  {
        const row = []
        for(let x=0; x<gridSize; x++) {
          // is a diamond point
          const val = (y%initColCount===0 && x%initColCount===0 && z%initColCount===0) ? seeder.get()*generationMaxValue : 0
          // is a normal field point //+toFixed(randfloat(), terrainHumanize)
          row.push(new Cube(x, y, z, val, val?true:false))
        }
        sliceY.push(row)
      }
      this.grid.push(sliceY)
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
        [x-r, y+r, z-1], [x, y+r, z-1], [x+r, y+r, z-1]
      ],
      // layer
      [
        [x-r, y-r, z], [x, y-r, z], [x+r, y-r, z],
        [x-r, y  , z],              [x+r, y  , z],
        [x-r, y+r, z], [x, y+r, z], [x+r, y+r, z]
      ],
      // layer bottom
      [
        [x-r, y-r, z+1], [x, y-r, z+1], [x+r, y-r, z+1],
        [x-r, y  , z+1], [x, y,   z+1], [x+r, y  , z+1],
        [x-r, y+r, z+1], [x, y+r, z+1], [x+r, y+r, z+1]
      ]
    ];
    let sum = 0
    let count = 0
    for(let layer of dir) {
      for(let i of layer) {
        if(i.filter((n)=>n>=0 && n < gridSize).length === i.length) {
          const c = this.grid[i[2]][i[1]][i[0]]
          sum += c.v
          count+= c.v===0 ? terrainInheritCount : 1
        }
      }
    }
    return round(sum/count)
  }

  /** main diamond function (own version) */
  diamond(iterations = terrainIterations) {
    for(let i = 0; i < iterations; i++) {
      const iterGrid = [...this.grid]
      for(let pz=0; pz<gridSize; pz++) {
        for(let py=0; py<gridSize; py++) {
          for(let px=0; px<gridSize; px++) {
            iterGrid[pz][py][px].v = this.#calcualteNeighbours(px, py, pz)
            // on the last iteration we assign a fixed value as material
            if(i === iterations-1) {
              iterGrid[pz][py][px].mat = material.hslConverter(iterGrid[pz][py][px].v)
            }
          }
        }
      }
      this.grid = iterGrid
      this.flatGrid = iterGrid.flat(2)
    }
  }

  dev() {
    for(let pz=0; pz<gridSize; pz++) {
      for(let py=0; py<gridSize; py++) {
        for(let px=0; px<gridSize; px++) {
              let {x, y, z, mat, isIni} = this.grid[pz][py][px]
              x = x + px*2
              y = y + py*1.2

              // drawBLock(x-3+px*2, y-8+py*4, z , mat) 
              if(isIni) drawBLock(x, y, z , mat) 
              else drawBLock(x, y, z , hsl(0, 0, 70, 0.1, true)) 
          }
      }
    }
  }
  addColor() {
    for(let pz=0; pz<gridSize; pz++) {
      for(let py=0; py<gridSize; py++) {
        for(let px=0; px<gridSize; px++) {
          const {x, y, z, v, mat, isIni} = this.grid[pz][py][px]
          if(isIni){
            const r = randint(-generationMaxValue, generationMaxValue)
            this.grid[pz][py][px].v = overcount(v+r, generationMaxValue)
          }
        }
      }
    }
  }
  draw() {
    // smooth rotation, normalize theta at 0.1
    if(gThetaX != 0) {
      gThetaX = toFixed(gThetaX/gThetaDec, 2) 
    }
    if(gThetaY != 0) {
      gThetaY = toFixed(gThetaY/gThetaDec, 2) 
    }
    this.flatGrid.forEach((i)=> i.project())
    this.flatGrid.sortAc('depth')
    this.flatGrid.forEach((i)=> i.draw())
  }

  generate() {
    this.#setup()
    this.diamond()
  }
}


function drawBLock(pt) {
  const {projx:x, projy:y, projz:z, v, mat:cl} = pt

  const d =  gridSize/3
  if(x>d && y>d && z>d  &&  x<10 && y<10 && z<900 ) return

  const lightDis = distanceToZ({x:x*tileWidth, y:y*tileHeight, z:z*(tileHeight+tileWidth)/2}, lighting)
  // global light value
  const glv = (lightDis*((z)/20)*lighting.l)/gridSize

  //markPoint(lighting.x, lighting.y, 50, {txt: str("no z")})




  const top = hsl(cl.v, cl.s, glv, cl.a),
  bottom = hsl(cl.v, cl.s, glv*0.1, cl.a),
  left = hsl(cl.v, cl.s, glv*0.6, cl.a),
  right = hsl(cl.v, cl.s, glv*0.8, cl.a);

  let zileHeight = z * tileHeight
  // adds 1 as 0 is flat
  ctx.save()
  ctx.translate((x-y) * tileWidth/2, (x+y) * tileHeight/2)


  const topy = tileHeight/2-zileHeight
  // bottom
  ctx.fillStyle = bottom
  ctx.beginPath()
  ctx.moveTo(0, topy+tileHeight/2)
  ctx.lineTo(tileWidth/2, topy+tileHeight)
  ctx.lineTo(0, topy+tileHeight*1.5)
  ctx.lineTo(-tileWidth/2, topy+tileHeight)
  ctx.closePath()
  ctx.fill()

  // top
  ctx.fillStyle = top
  ctx.beginPath()
  ctx.moveTo(0, -zileHeight)
  ctx.lineTo(tileWidth/2, topy)
  ctx.lineTo(0, tileHeight-zileHeight)
  ctx.lineTo(-tileWidth/2, topy)
  ctx.closePath()
  ctx.fill()
  // left

  ctx.fillStyle = left

  ctx.beginPath()
  ctx.moveTo(-tileWidth/2, topy)
  ctx.lineTo(0, tileHeight-zileHeight)
  ctx.lineTo(0, tileHeight-zileHeight+tileHeight)
  ctx.lineTo(-tileWidth/2, topy+tileHeight)
  ctx.closePath()
  ctx.fill()

  // left
  ctx.fillStyle = right
  ctx.beginPath()
  ctx.moveTo(tileWidth/2, topy)
  ctx.lineTo(0, tileHeight-zileHeight)
  ctx.lineTo(0, tileHeight-zileHeight+tileHeight)
  ctx.lineTo(tileWidth/2, tileHeight/2-zileHeight+tileHeight)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}



const main= ()=> {
  const grid = new Grid()
  grid.generate()
  //grid.flatGrid.sortAc('z')
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
    requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)
}
const seeder = new Seeder(757585)
ctx.background('#111')
main()



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