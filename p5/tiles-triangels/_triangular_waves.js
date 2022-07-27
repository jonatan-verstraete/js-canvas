p5.disableFriendlyErrors = true; // disables FES

const noiseScale = 50
const noiseDf = 100

const skipStep = 50
let noiseOff=0
const pointMap = new Map()

class Shape {
  constructor(x, y) {
    this.x = x
    this.y = y

    this.xn = 0
    this.yn = 0
    this.a = {}
    this.b = {}
    this.c = {}
  }
  init() {
    const {a, b, c} = getTwooClosest(this)
    this.a = coords(a)
    this.b = coords(b)
    this.c = coords(c)
  }
  update() {
    //const deg = map(noise(this.x, this.y), 0, 1, 0, 360)
    //const {x, y} = p5.Vector.fromAngle(radians(deg)+noiseOff, noiseScale) 

    //const {x, y} = p5.Vector.fromAngle(map(noise(this.x+noiseOff, this.y+noiseOff), 0, 1, 0, 360), noiseScale) 
    const {x, y} = vectorFromCoords(noise(this.x+noiseOff, this.y+noiseOff)*noiseDf, noiseScale)//map(noise(this.x+noiseOff, this.y+noiseOff), 0, 1, -noiseScale, noiseScale)) 
    
    this.xn = this.x+x
    this.yn = this.y+y
  }
  show() {
    const a = pointMap.get(this.a)
    const b = pointMap.get(this.b)
    const c = pointMap.get(this.c)

    beginShape()
    vertex(a.xn, a.yn)
    vertex(b.xn, b.yn)
    vertex(c.xn, c.yn)
    endShape(CLOSE)

  }
}

function getTwooClosest(p) {
  const pts = JSON.copy([...pointMap.values()].map(i=>{return {x:i.x, y:i.y}})) 
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


function setup() {
  createCanvas(windowWidth-400, windowHeight)
  noiseSeed(10)
  strokeWeight(1)
  stroke("#aaa")
  noFill()
  fill(255)


  for(let y=0;y<height;y+=skipStep) {
    for(let x=0;x<width;x+=skipStep) {
      pointMap.set(coords(x, y), new Shape(x, y))
    }
  }
  for(let [k, val] of pointMap.entries()) {
    val.init()
  }
  for(let [k, val] of pointMap.entries()) {
    val.update()
  }
}


  


async function draw() {
  background(255)
  noiseOff+=0.0001

  const _ = [...pointMap.values()].forEach((val, idx)=>{
    val.update()
    if(idx%2==0){
    val.show()}
  })
  // for(let val of pointMap.values()) {
  //   val.update()
  //   val.show()
  // }
}