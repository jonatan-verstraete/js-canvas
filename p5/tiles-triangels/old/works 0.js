
const scale = 80
const degs = {
  min:30,
  max:150
}
const freeSideStack = []
let currentSide = null
let direction = 180

function sideIsOutBounds(side) {
  const m = 50
  for(let i of side.chunk(2)) {
    const {0:x, 1:y}=i
    // if(x > width || x < 0 || y > height || y < 0) return true

    if(x > width-m || x < 0+m || y > height-m || y < 0+m) return true
  }
  return false
}



function genShape(trial=false) {
    const {0:x1, 1:y1, 2:x2, 3:y2 } = currentSide

    const degs = direction + map(noise(x1, y1), 0, 1, 30, 150)

    // add pythagoras to replace the scale with an appropriate size
    const v = p5.Vector.fromAngle(radians(degs), scale)
    const x3 = x1-v.x
    const y3 = y1-v.y

    const sides = [
      [x1, y1, x2, y2],
      [x2, y2, x3, y3],
      [x3, y3, x1, y1],
    ]
    if(trial) return log(sides)

    const cols = ["red", "blue", "green"]
    for (let i of sides) {
      //stroke(cols[sides.indexOf(i)])
      line(...i)
    }
    currentSide = sides[1]
    freeSideStack.push(sides[2])
    return sides
}


function setup() {
  createCanvas(windowWidth, windowHeight)
  background(255)
  noiseSeed(10)
  const dmpo82l = 200
  currentSide = [dmpo82l, dmpo82l, dmpo82l, dmpo82l+scale]
  genShape()
}



async function draw() {

  if(pause) return
  background("#ffffff0a")


  if(sideIsOutBounds(currentSide)) {
    direction=overcount(direction+45, 360)
    currentSide = freeSideStack.pop()
    currentSide = freeSideStack.pop()

    return 
  }

  if(freeSideStack.length<=0) {
    noLoop()
    return warn(' - - - - - - No Free Sides !  - - - - - - - ')
  }
  
  genShape()
  await sleeping(0.02)
}