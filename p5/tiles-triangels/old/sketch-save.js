
const scale = 80
let cols = null
let rows = null
const pointMap = []
const minDeg = 30

const shapeStack = []
const freeSideStack = []
let lastShape = null


function shapeIsOutOfsight(shape) {
  return shape.sides.some((i) => i.x > width || i.x < 0 || i.y > height || i.y < 0)
}

class Side {
  constructor(a, b, c, d, isOUt=false) {
    this.side = [a, b, c, d]
    this.out = isOUt
    this.x = a
    this.y = b
  }
}
class Shape {
  constructor(x1, y1, x2, y2, x3, y3) {
    this.points = [x2, y2, x3, y3]
    this.sides = [
      new Side(x1, y1, x2, y2, true),
      new Side(x2, y2, x3, y3),
      new Side(x3, y3, x1, y1),
    ]
    this.next = 0
  }
  nextSide() {
    this.next++
    if(this.next>=this.sides.length) return false
    this.sides[this.next].out = true
    return this.sides[this.next]
  }
  draw() {
    push();
    for (let i of this.sides) {
      line(...i.side)
    }
    line(...this.sides[0].side)
    pop()
  }
}

function lastNonOut() {
  const l=shapeStack.length-1
  for(let i =l; i>0;i--) {
    const c = shapeStack[i]
    if(c.sides.some(i=>!i.out)) {
      log(c)
      return c
    }
  }
  log('NO SHAPE FOUND')
  return null
}



function setup() {
  createCanvas(windowWidth, windowHeight)
  cols = ceil(width / scale)
  rows = ceil(height / scale)
  noiseSeed(10)

  const dmpo82l = 200
  lastShape = new Shape(dmpo82l, dmpo82l,dmpo82l, dmpo82l+scale, dmpo82l+scale, dmpo82l)
}


async function draw() {
  background(255)
  noLoop()

  for (let _ of range(200)) {
    const current = lastShape.nextSide()
    log(current)
    if(!current || current.sides.every(i=>i.out)) current = lastNonOut()
    if(!current) return warn('409: NO CURRENT')

    const {0:a, 1:b, 2:c, 3:d } = current.side

    let degs = map(noise(a, b), 0, 1, 0, 360)
    if (degs < minDeg) {
      log('small')
      degs = 30
    }
    const v = p5.Vector.fromAngle(radians(degs), scale)
    const s = new Shape(c, d, a+v.x, b+v.y, a, b)
    s.draw()
    //log(lastShape, s, shapeStack.length)


    // if shape is outside of view
    if (shapeIsOutOfsight(s) || s.sides.every(i=>i.out)) {
      log('-out')
      // if all sides of current shape are out
      // if(lastShape.sides.every(i=>i.out)) lastShape = shapeStack.pop()

      s.sides.forEach(i=> {
        i.out = true
      })
      lastShape = lastNonOut()

    } else {
      if(s.next<=1) {
        log('pushed')
        lastShape = s
        shapeStack.push(s)
      }
    }
    if(pause) return
    await sleep(0.2)
  }
}