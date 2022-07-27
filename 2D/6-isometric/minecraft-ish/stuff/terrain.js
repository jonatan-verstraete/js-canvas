/**
 * isometric terrain generation
 * sources:
 * - isometric (fully implemented with added bottom surface for water/-y surfaces) && part II of the videos: https://www.youtube.com/watch?v=go1qrWFw_bs
 * - terrain generation (only read the first part and made my own thing of the diamond concept): https://yonatankra.com/how-to-create-terrain-and-heightmaps-using-the-diamond-square-algorithm-in-javascript/
 */
const tileWidth = 60,   
tileHeight = 30,
gridSize = 20,
// 3d y scale height
maxTileYHeight = 3,
// the resuduel.. sometinhg.. of inital colors are generated
initColCount = 2,
// count fo diamon algorithm usage (sort of rawness or contrast)
terrainIterations = 3,
// the value of which numbers inherit from other numbers by diamon algorithm (that handles contrast DO NOT CHANGE THIS. 0.01)
terrainInheritCount = 0.01,
// the reach (only border points, not really reach) of diamond structure
terrainSpread = 1,
// 0-n is how much floats are used
terrainHumanize = 3;

// the current posisiton of the map
let spX = Xmax/2,
spY = 250;



const material = {
    ocean: hsl(230, 50, 40, 0.8, true),
    water: hsl(210, 60, 50, 0.7, true),
    shallow: hsl(195, 60, 60, 0.6, true),
    grass: hsl(120, 50, 50, 1, true),
    rock: hsl(60, 20, 20, 1, true),
    earth: hsl(45, 50, 30, 1, true),
    sand: hsl(40, 40, 80, 1, true),
    white: hsl(0, 0, 100, 1, true),
    black: hsl(0, 0, 0, 1, true),

    // assigns color by hsl value
    hslConverter(val) {
      val = overcount(val, 360)
      if(val > 240) return this.ocean
      if(val > 210) return this.water
      if(val > 190) return this.shallow
      if(val > 150) return this.sand
      if(val > 100) return this.grass
      if(val > 80) return this.earth
      if(val > 60) return this.rock
      if(val > 40) return this.black
      return this.white
    },
    // levels out heights by type
    checkHeight(height, type) {
      const th = maxTileYHeight
      const sandh =  {min: 0, max: th * 0.1}
      const grassh = {min: 0, max: th * 0.38}
      const earthh = {min: th * 0.4, max: th * 0.6}
      const rock = {min: th * 0.6, max: th * 0.9}
      const white = {min: th * 0.8, max: th}


      switch(type) {
        // water
        case this.water: case this.ocean: case this.shallow:
          return -0.1
        // sand
        case this.sand:
          return height > sandh.max ? scaleNum(height, 0, maxTileYHeight, sandh.min, sandh.max) : height
        // grass
        case this.grass:
          return height > grassh.max ? scaleNum(height, 0, maxTileYHeight,  grassh.min, grassh.max) : height
        // earth
        case this.earth:
          return scaleNum(height, 0, maxTileYHeight,  earthh.min, earthh.max)
        // rock 
        case this.rock:
          return scaleNum(height, 0, maxTileYHeight, rock.min, rock.max)
        // white 
        case this.white:
          return scaleNum(height, 0, maxTileYHeight, white.min, white.max)
        // default
        default:
          return height


      }
    }
}

class Grid {
  setup() {
    this.grid = []
    for(let x = 0; x< gridSize; x++)  {
      const row = []
      for(let y = 0; y< gridSize; y++) {
        // is a diamond point
        if(y%initColCount ===0 && x%initColCount ===0) row.push({x:x*tileWidth, y:y*tileWidth, v: randint(360), c:false})
        // is a normal field point
        else row.push({x:x*tileWidth, y:y*tileWidth, v: 0, c:true})
      }
      this.grid.push(row)
    }
  }
  /** getst he average vale of all serrounding fields (at a certain distance) */
  calcualteNeighbours(x, y) {
    const r = terrainSpread
    const dir =[[x-r, y-r], [x, y-r], [x+r, y-r],
              [x-r, y  ],           [x+r, y  ],
              [x-r, y+r], [x, y+r], [x+r, y+r]];
    let sum = 0
    let count = 0
    for(let i of dir) {
      if(i[0]>=0 && i[1]>=0 && i[0]<=this.grid[0].length-1 && i[1]<=this.grid.length-1) {
        const c = this.grid[i[1]][i[0]]
        sum += c.v
        count+= c.v===0 ? terrainInheritCount : 1
      }
    }
    return round(sum/count)
  }
  /** dispalyes grid with values and colors */
  dev(markInitalPoints=false) {
    for(let py of this.grid) {
      for(let px of py) {
        const {x, y, v} = px

        if(markInitalPoints && this.grid.indexOf(px)%initColCount ===0 && px.indexOf(py)%initColCount ===0) square(x, y, tileWidth, "blue", "blue")
        else square(x, y, tileWidth, "blue", hsl(v))

        ctx.fillStyle = "white"
        ctx.fillText(str(v), x+tileWidth/2, y+tileWidth/2)
      }
    }
  }
  /** main diamond function (own version) */
  diamond(iterations = terrainIterations) {
    for(let i = 0; i< iterations; i++) {
      const iterGrid = [...this.grid]
      for(let px = 0; px < this.grid.length; px++) {
        for(let py =0; py < this.grid[0].length; py++) {
          // if(this.grid[px][py].c || true)
           iterGrid[px][py].v = this.calcualteNeighbours(px, py)
        }
      }
      this.grid = iterGrid
    }
  }
}


function drawBLock(x, y, z=1, cl={}) {
    const top = hsl(cl.v, cl.s, cl.l+10, cl.a),
    bottom = hsl(cl.v, cl.s, 10, cl.a)
    left = hsl(cl.v, cl.s, posInt(cl.l-20), cl.a),
    right = hsl(cl.v, cl.s, posInt(cl.l-10), cl.a);
    // adds 1 as 0 is flat
    z += 1
    ctx.save()
    ctx.translate((x-y) * tileWidth/2, (x+y) * tileHeight/2)

    // bottom
    ctx.fillStyle = bottom
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(tileWidth/2, tileHeight/2)
    ctx.lineTo(0, tileHeight)
    ctx.lineTo(-tileWidth/2, tileHeight/2)
    ctx.closePath()
    ctx.fill()
    // top
    ctx.fillStyle = top
    ctx.beginPath()
    ctx.moveTo(0, -z*tileHeight)
    ctx.lineTo(tileWidth/2, tileHeight/2-z*tileHeight)
    ctx.lineTo(0, tileHeight-z*tileHeight)
    ctx.lineTo(-tileWidth/2, tileHeight/2-z*tileHeight)
    ctx.closePath()
    ctx.fill()
    // left
    ctx.fillStyle = left
    ctx.beginPath()
    ctx.moveTo(-tileWidth/2, tileHeight/2-z*tileHeight)
    ctx.lineTo(0, tileHeight-z*tileHeight)
    ctx.lineTo(0, tileHeight)
    ctx.lineTo(-tileWidth/2, tileHeight/2)
    ctx.closePath()
    ctx.fill()
    // left
    ctx.fillStyle = right
    ctx.beginPath()
    ctx.moveTo(tileWidth/2, tileHeight/2-z*tileHeight)
    ctx.lineTo(0, tileHeight-z*tileHeight)
    ctx.lineTo(0, tileHeight)
    ctx.lineTo(tileWidth/2, tileHeight/2)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
}



function generateGrid() {
    const gd = new Grid()
    gd.setup()
    gd.diamond(3)


    

    return gd.grid.map((x)=> x.map((i)=>{
      const mat = material.hslConverter(i.v)
      const height = material.checkHeight( toFixed(randfloat(maxTileYHeight), terrainHumanize), mat)
      return [mat, height]
    }) )

}
const grid = generateGrid()


const animate = async() => {
    clear()
    ctx.translate(spX, spY)

    for(let x of range(grid.length)) {
        for(let y of range(grid[0].length)) {
            const c = grid[x][y]
            drawBLock(x, y, c[1] , c[0]) 
        }
    }
    ctx.translate(-spX, -spY)
    await pauseHalt()
    await sleep(.1)
    requestAnimationFrame(animate)
}




const inc = 10
window.onkeydown = (e)=> {
  if(pause) return
  const ev = e.key
  if(ev === 'ArrowUp') {
    spY -= inc
  } else if(ev === 'ArrowDown') {
    spY += inc
  } else if(ev === 'ArrowLeft') {
    spX -= inc
  } else if(ev === 'ArrowRight') {
    spX += inc
  }
}


animate()