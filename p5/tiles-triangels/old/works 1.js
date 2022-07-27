
const scale = 80
const degs = {
  min:30,
  max:150
}
const skipStep = 50

class Shape {
  constructor(x, y) {
    let total = range(360)
    this.scale = scale
    const corners =[] 
    for(let i of range(2)) {
      const n = map(noise(x+i, y+i), 0, 1, 0, total.length)
      const s = map(noise(x+i, y+i), 0, 1, 0, this.scale)
      const deg = total.splice(0, n).length
      const {x:xn, y:yn} = p5.Vector.fromAngle(radians(deg), s) 
      corners.push(x+xn, y+yn)
    }
    const {0:x2, 1:y2, 2:x3, 3:y3}=corners
    this.sides = [
      [x , y , x2, y2],
      [x2, y2, x3, y3],
      [x3, y3, x , y ],
    ]
  }
  draw() {
    for (let i of this.sides) line(...i)
  }
}



function setup() {
  createCanvas(windowWidth, windowHeight)
  background(255)
  noiseSeed(10)
  const s = new Shape(300, 500)
  s.draw()
}



async function draw() {
  noLoop()
  for(let y=0;y<height;y+=skipStep) {
    for(let x=0;x<width;x+=skipStep) {
      const s = new Shape(x, y)
      s.draw()
    }
  }
}