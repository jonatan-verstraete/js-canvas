p5.disableFriendlyErrors = true; // disables FES

const vidWidth = 128
const vidHeight = 96

const detectResolution = 1
const pxScale = 8

const pointMap = new Map()

let center = {}
let vidScale = 0
let video;
let img;

const scanArea= {
  x0: 25,
  y0: 13,
  xn: 103,
  yn: 83
}

function drawScanArea() {
    const a = scanArea.x0*pxScale
    const b= scanArea.y0*pxScale
    noFill()
    stroke("red")
    strokeWeight(2)
    rect(a, b, scanArea.xn*pxScale-a, scanArea.yn*pxScale-b)
}


// fittering 1
function compression1() {
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
}

// fittering 2
function compression2() {
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
}


function compressionLines() {
  const compRange = 80
  // filters out point areas that are too populated
  for(let [key, src] of pointMap.entries()) {
      if(distanceTo(src, src.next) > compRange) pointMap.delete(key)
  }
}
