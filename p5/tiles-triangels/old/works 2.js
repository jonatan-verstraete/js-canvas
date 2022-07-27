
const noisecale = 80
const skipStep = 50
const points = []
let noiseOff=0
const pointMap = new Map()

class Shape {
  constructor(a, b, c) {
    this.a=a
    this.b=b
    this.c=c
  }
  show() {
    const a = pointMap.get(this.a)
    const b = pointMap.get(this.b)
    const c = pointMap.get(this.c)
    this.sides = [
      [c.x, c.y, a.x, a.y],
      [a.x, a.y, b.x, b.y],
      [b.x, b.y, c.x, c.y],
    ]
  }
}

function getTwooClosest(p) {
  const pts = JSON.copy(points) 
  let a = [Infinity]
  let b = [Infinity]
  let c = [Infinity]

  // a
  for(let i of pts) {
    const d = distanceTo(p, i)
    if(d < a[0] && d > 0)  a = [d, i]

  }
  pts.splice(pts.indexOf(a[1]), 1)

  // b
  for(let i of pts) {
    const d = distanceTo(p, i)
    if(d < b[0] && d > 0) b = [d, i]
  }
  pts.splice(pts.indexOf(b[1]), 1)

  // c
  for(let i of pts) {
    const d = distanceTo(p, i)
    if(d < c[0] && d > 0) c = [d, i]
  }
  return {a:a[1], b:b[1], c:c[1]}
}

function setPoints() {
  noiseOff+=0.1
  points.length = 0

  for(let y=0;y<height;y+=skipStep) {
    for(let x=0;x<width;x+=skipStep) {
      const deg = map(noise(x, y), 0, 1, 0, 360)
      const {x:xn, y:yn} = p5.Vector.fromAngle(radians(deg)+noiseOff, noisecale) 
      points.push({x:x+xn, y:y+yn})
      //points.push({x:x, y:y})
    }
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight)
  noiseSeed(10)
  strokeWeight(2)
}


  


async function draw() {
  background(255)
  //noLoop()
  setPoints(noiseOff)

  for(let p of points) {
    const {a, b, c} = getTwooClosest(p)
    const sides = [
      [c.x, c.y, a.x, a.y],
      [a.x, a.y, b.x, b.y],
      [b.x, b.y, c.x, c.y],
    ]
    for (let n of sides) line(...n)
  }
}