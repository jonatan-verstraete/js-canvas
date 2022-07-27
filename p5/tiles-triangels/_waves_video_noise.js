p5.disableFriendlyErrors = true; // disables FES

const pointMap = new Map()

const noiseScale = 10
const vidWidth = 128
const vidHeight = 96

const vidDetail = 3
const pxScale = 8

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
  }
  init() {
    const { a, b, c } = getTwooClosest(this)
    this.a = coords(a)
    this.b = coords(b)
    this.c = coords(c)
  }
  update() {
    const { x,y } = vectorFromCoords(noise(this.x+noiseOff, this.y+noiseOff), noiseScale)
    this.xn = this.x + x - 5
    this.yn = this.y + y - 5
  }
  draw() {
    const a = pointMap.get(this.a)
    const b = pointMap.get(this.b)
    const c = pointMap.get(this.c)

    const _r = video.pixels[this.pxIdx+ 0];
    const _g = video.pixels[this.pxIdx+ 1];
    const _b = video.pixels[this.pxIdx+ 2];
    const cl = map((_r + _g + _b)||3 / 3, 0, 255, 0, 1)
    //fill(_r, _g, _b)
    fill("rgba(0,0,0," + (1-cl) + ")")
    beginShape()
    vertex(a.xn*pxScale, a.yn*pxScale,)
    vertex(b.xn*pxScale, b.yn*pxScale,)
    vertex(c.xn*pxScale, c.yn*pxScale,)
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
  };

  video = createCapture( constraints );

  video.size(vidWidth, vidHeight);
  noiseSeed(10)
  strokeWeight(1)
  noStroke()
  //noFill()


  for (let y = 0; y < video.height; y += vidDetail) {
    for (let x = 0; x < video.width; x += vidDetail) {
      const pxIdx = (x + y * video.width)*4
      pointMap.set(coords(x, y), new Shape(x, y, floor(pxIdx)))
    }
  }

  for (let [k, val] of pointMap.entries()) {
    val.init()
  }
  
  for (let [k, val] of pointMap.entries()) {
    val.update()
  }
  log('-- setup: done')
}


async function draw() {
  background(255)
  video.loadPixels()
  noiseOff += 0.01

  for (let val of pointMap.values()) {
    val.update()
    val.draw()
  }
}