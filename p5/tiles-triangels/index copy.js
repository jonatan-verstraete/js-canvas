p5.disableFriendlyErrors = true; // disables FES

const pointMap = new Map()

const noiseScale = 30
const vidWidth = 128
const vidHeight = 96

const vidDetail = 3
const pxScale = 8

const compRange = 15
const compMax = 3

let center = {}
let vidScale = 0
let noiseOff = 0
let video;


class Shape {
  constructor(x, y, pxIdx) {
    this.x = x
    this.y = y
    this.pxIdx = pxIdx

    this.xn = 0
    this.yn = 0
    this.a = {}
    this.b = {}
    this.c = {}
    this.maxedArea=false
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
    
    if(getAreaBySides(a, b, c) > 400) this.maxedArea=true
  }
  update() {
    const { x,y } = vectorFromCoords(noise(this.x+noiseOff, this.y+noiseOff), noiseScale)
    this.xn = this.x + x - 5
    this.yn = this.y + y - 5
  }
  draw() {
    // if maxarea, it soley exits as point or other shapes
    if(this.maxedArea) return 
    const a = pointMap.get(this.a)
    const b = pointMap.get(this.b)
    const c = pointMap.get(this.c)

    stroke('red')
    beginShape()
    vertex(a.xn, a.yn,)
    vertex(b.xn, b.yn,)
    vertex(c.xn, c.yn,)
    endShape(CLOSE)

  }
}

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
  const prevSize  = pointMap.size
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
  // filter points that lay too far off from the center
  distanceTo
  log('=* filtering 1: done', pointMap.size, '->', prevSize)
}


function initShape() {
  // +?perform: next iteration: only look for points close to the points we already have
  pointMap.clear()

  for(let x = 0; x < video.width; x+=1) {
    for(let y = 0; y < video.height; y+=1) {
      const d = 2
      const _x = x*pxScale
      const _y = y*pxScale
      // filter out pixels based on location, index
      if(x%d===0 && y%d===0) {
        // filter on distance to center
        //if(distanceTo({x:x, y:y}, center) < 400) {}
        const pixelIndex = (x + y * video.width)*4
        const r = video.pixels[pixelIndex + 0];
        const g = video.pixels[pixelIndex + 1];
        const b = video.pixels[pixelIndex + 2];
        /** rbg values of outline face */
        // 117 77 56
        // 117 90 69
        const colorstric = 40
        // filter on color
        if(inRange(r, 117, colorstric) && inRange(g, 90, colorstric) && inRange(b, 69, colorstric) ) { // if r g b all less than 80 then color will appear black
          pointMap.set(coords(_x, _y), new Shape(_x, _y, 0))
        }
      }
    }
  }
  compressPoints()

  // init shapes. all different loops, as each loop waits for previous loops results
  for (let val of pointMap.values()) val.init()
  for (let val of pointMap.values()) val.update()
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

  if(video.pixels[1000] > 0) {
    noLoop()
    log('--- start')
  } else {
    return 
  }
  initShape()

  for (let val of pointMap.values()) {
    val.update()
    text(floor(distanceTo({x:val.x, y:val.y}, center)), val.x, val.y)
  }

  // for (let val of pointMap.values()) {
  //   val.update()
  //   val.draw()
  // }
  noiseOff += 0.01
}