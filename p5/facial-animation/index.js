
const scanColor= {
  /*facial border:*/
  // 117 77 56
  // 117 90 69
  // 93 44 42
  // 106 65 45
  // r: 130, g: 90, b: 70
  r: 151, g: 106, b: 88,
  //r: 142, g:94, b:77,
  /*skin color:*/
  // 206 160 155
  // 232 190 172
  //r: 70, g: 30, b: 20
}
// at: initShape()
const colorTreshold = 10
// at: setNext()
const distanceTreshold = 30 
// at: compression()
const compRange = 20
const compMax = 6

let proportions;


class Shape {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.next = ""
  }
  draw() {
    strokeWeight(8)
    if(this.next) stroke('green')
    else stroke('purple')
    point(this.x, this.y)

    if(!this.next || !this.next.next) return
    strokeWeight(2)
    stroke('red')

    line(this.x, this.y, this.next.x, this.next.y)
  }
}

function getLines() {
  /*
    compare lines:
    e.G looking for the facial chin

    get their outer edges (a rectangle) of all lines
    if this rectangle more or les in about the right place -> (looked up in comparison of idea face)
    all other ines udnder the chin can be filtered

  */
  const lineTreshold = 6
  const lines = []
  for (let [src, key] of pointMap.entries()) {
    for(let i of lines) {
      if(i.includes(src)) continue
    }
    const current = []
    let next = src.next
    while(next) {
      current.push(next)
      next = next.next
    }
    if(current.length > lineTreshold) lines.push(current)
  }
  lines.sort((a, b)=>b.length-a.length)
  return lines
}


function setNext() {
  for (let [key, src] of pointMap.entries()) {
    let a = [Infinity]
    for (let targ of pointMap.values()) {
      const d = distanceTo(src, targ)
      if (d < a[0] && d > 0 && !targ.next ) a = [d, targ]   //&& a[0] < distanceTreshold
    }

    if( a[0] > distanceTreshold) continue//pointMap.delete(key)
    else src.next = a[1]
  }
}

function initShape() {
  pointMap.clear()
  const a = scanArea.x0*pxScale
  const b= scanArea.y0*pxScale
  image(video, a, b, scanArea.xn*pxScale-a, scanArea.yn*pxScale-b);


  for(let x = scanArea.x0; x < scanArea.xn; x+=1) {
    for(let y = scanArea.y0; y < scanArea.yn; y+=1) {
      const _x = x*pxScale
      const _y = y*pxScale
      // filter out pixels based on location, index
      if(x%detectResolution===0 && y%detectResolution===0) {
        const [r, g, b] = get(_x, _y)
        // filter on color
        if(inRange(r, scanColor.r, colorTreshold) && inRange(g, scanColor.g, colorTreshold) && inRange(b, scanColor.b, colorTreshold) ) { // if r g b all less than 80 then color will appear black
          pointMap.set(coords(_x, _y), new Shape(_x, _y, 0))
        }
      }
    }
  }
  compression2()
  setNext()
}




function setProportions() {
  // get outer adges
  let maxX = 0
  let maxY = 0
  let minX = Infinity
  let minY = Infinity
  
  for(let i of pointMap.values()) {
    const {x, y} = i
    if(x<minX) minX = x
    if(y<minY) minY = y
    if(y>maxY) maxY = y
    if(x>maxX) maxX = x
  }

  strokeWeight(3)
  rect(minX, minY, maxX-minX, maxY-minY)
  log(minX, minY, maxX, maxY)

  proportions = new Proportions(minX, minY, maxX, maxY)
  proportions.drawSketch()

}

function preload() {
  video = loadImage('../../assets/face_profile02.jpeg');
}



function setup() {
  createCanvas(vidWidth*pxScale, vidHeight*pxScale)
  center = {x:width/2, y:height/2}
  noFill()
}

function draw() {
  noLoop()
  background(255)

  initShape()
  //drawScanArea()
  strokeWeight(1)


  // beginShape();
  // const m = [...pointMap.values()]
  // let c = m[5]
  // for(let _ of m){
  //   if(!c.next) return endShape();
  //   log(c)
  //   curveVertex(c.x, c.y)
  //    c = c.next
  // }
  

  for (let val of pointMap.values()) {
    val.draw()
  }
  setProportions()
}