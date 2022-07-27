p5.disableFriendlyErrors = true; // disables FES

const pointMap = new Map()


const vidWidth = 128
const vidHeight = 96
const vidDetail = 3
const pxScale = 8


let center = {}
let vidScale = 0
let noiseOff = 0
let video;

const scanArea= {
  x0: 25,
  xn: 103,
  y0: 13,
  yn: 83
}

const scanColor= {
    /*
  --facial border:
  117 77 56
  117 90 69
  93 44 42
  --skin color:
  206 160 155
  232 190 172
  */
  r: 117,
  g: 77,
  b: 60
}

function dev1() {
  let minX = Infinity
  let maxX = 0
  let minY = Infinity
  let maxY = 0

  //200 104 824 664
  for(let x = 0; x < video.width; x+=1) {
    for(let y = 0; y < video.height; y+=1) {
      const _x = x*pxScale
      const _y = y*pxScale

      const dis = distanceTo({x:_x, y:_y}, center, false)
      if(abs(dis.x) < vidWidth*2.5 && abs(dis.y) < vidHeight*3 ) {
        point(x*pxScale, y*pxScale)
        if(x<minX) minX=x
        else if(y<minY) minY=y
        else if(x>maxX) maxX=x
        else if(y>maxY) maxY=y
      }
    }
  }
  log('minX', 'maxX', 'minY', 'maxY')
  log(...[minX, maxX, minY, maxY].map(i=>i*pxScale))
  log(minX, maxX, minY, maxY)
  aaaaaarrch()
}

function drawScanArea() {
  const a = scanArea.x0*pxScale
  const b= scanArea.y0*pxScale

  noFill()
  stroke("red")
  rect(a, b, scanArea.xn*pxScale-a, scanArea.yn*pxScale-b)

}

class Shape {
  constructor(x, y) {
    this.x = x
    this.y = y

    this.a = ""
    this.b = ""
    this.c = ""
  }
  init() {
    const { a, b, c } = getTwooClosest(this)
    this.a = coords(a)
    this.b = coords(b)
    this.c = coords(c)
  }
  checkArea() {
    const _a = pointMap.get(this.a)
    const _b = pointMap.get(this.b)
    const _c = pointMap.get(this.c)
    const a = distanceTo(_a, _b)
    const b = distanceTo(_b, _c)
    const c = distanceTo(_c, _a)
    
    if(getAreaBySides(a, b, c) > 500) this.maxedArea=true
  }
  draw() {
    if(this.maxedArea) return
    const a = pointMap.get(this.a)
    const b = pointMap.get(this.b)
    const c = pointMap.get(this.c)

    stroke('red')
    beginShape()
    vertex(a.x, a.y)
    vertex(b.x, b.y)
    vertex(c.x, c.y)
    endShape(CLOSE)

  }
}

// returns closest twoo points
function getTwooClosest(p) {
  const pts = JSON.copy([...pointMap.values()].map(i => {
    return {
      x: i.x,
      y: i.y
    }
  }))
  let a = [Infinity]
  let b = [Infinity]
  let c = [Infinity]

  // a
  for (let i of pts) {
    const d = distanceTo(p, i)
    if (d < a[0] && d > 0) a = [d, i]
  }
  pts.splice(pts.indexOf(a[1]), 1)

  // b
  for (let i of pts) {
    const d = distanceTo(p, i)
    if (d < b[0] && d > 0) b = [d, i]
  }
  pts.splice(pts.indexOf(b[1]), 1)

  // c
  for (let i of pts) {
    const d = distanceTo(p, i)
    if (d < c[0] && d > 0) c = [d, i]
  }
  return {
    a: a[1],
    b: b[1],
    c: c[1]
  }
}

// fittering 1
function compressPoints() {
  const compRange = 20
  const compMax = 3
  // filters out point areas that are too populated
  for(let [key, src] of pointMap.entries()) {
    let count = 0
    for(let targ of [...pointMap.values()]) {
      if(objInRange(src, targ, compRange)) count++
    }
    if(count > compMax) {
      pointMap.delete(key)
    }
  }
  
  //log('=* filtering 1: done', prevSize, "->", pointMap.size)
}


function isValidVideoPixel(idx) {
  return true
  idx/=pxScale
  const r = video.pixels[idx + 0];
  const g = video.pixels[idx + 1];
  const b = video.pixels[idx + 2];
  const colorstric = 80

  log(idx, r, g, b)


  /*
  --facial border:
  117 77 56
  117 90 69
  93 44 42
  --skin color:
  206 160 155
  232 190 172
  */
  // filter on color
  //log(inRange(r, 232, colorstric), r, 232, colorstric)
  if(inRange(r, 232, colorstric) && inRange(g, 190, colorstric) && inRange(b, 172, colorstric)) {
    return true
  }
  return false
}


function initShape() {
  // +?perform: next iteration: only look for points close to the points we already have
  pointMap.clear()

  // for(let x = scanArea.x0; x < scanArea.xn; x+=1) {
  //   for(let y = scanArea.y0; y < scanArea.yn; y+=1) {
  //     const d = 2
  //     // filter out pixels based on location, index
  //     if(x%d===0 && y%d===0) {
  //       if(isValidVideoPixel((x + y * video.width)*4)) {
  //         const _x = x*pxScale
  //         const _y = y*pxScale

  //         pointMap.set(coords(_x, _y), new Shape(_x, _y, 0))
  //       }
  //     }
  //   }
  // }

  for(let x = scanArea.x0; x < scanArea.xn; x+=1) {
    for(let y = scanArea.y0; y < scanArea.yn; y+=1) {
      const d = 2
      const _x = x*pxScale
      const _y = y*pxScale
      // filter out pixels based on location, index
      if(x%d===0 && y%d===0) {
        const pixelIndex = (x + y * video.width)*4
        const r = video.pixels[pixelIndex + 0];
        const g = video.pixels[pixelIndex + 1];
        const b = video.pixels[pixelIndex + 2];

        const colorstric = 40
        // filter on color
        if(inRange(r, scanColor.r, colorstric) && inRange(g, scanColor.g, colorstric) && inRange(b, scanColor.b, colorstric) ) { // if r g b all less than 80 then color will appear black
          pointMap.set(coords(_x, _y), new Shape(_x, _y, 0))
        }
      }
    }
  }

  compressPoints()

  // init shapes. all different loops, as each loop waits for previous loops results
  for (let val of pointMap.values()) val.init()
  for (let val of pointMap.values()) val.checkArea()
}



function setup() {
  createCanvas(vidWidth*pxScale, vidHeight*pxScale)
  const constraints = {
    video: {
      mandatory: {
        maxWidth: vidWidth,
        maxHeight: vidHeight
      }
    },
    audio: false
  }

  video = createCapture(constraints);
  video.size(vidWidth, vidHeight);
  center = {x:width/2, y:height/2}

  noiseSeed(10)
  strokeWeight(1)
  //noStroke()
}


async function draw() {
  //noLoop();
  background(255)
  video.loadPixels()

  // if(video.pixels[1000] > 0) {
  //   noLoop()
  //   log('--- start')
  // } else {
  //   return 
  // }
  initShape()

  // for (let val of pointMap.values()) {
  //   point(val.x, val.y)
  //   //text(floor(distanceTo({x:val.x, y:val.y}, center)), val.x, val.y)
  // }

  drawScanArea()
  for (let val of pointMap.values()) {
    val.draw()
  }
}