
const cols = ['#F0F8FF', '#FAEBD7', '#00FFFF', '#7FFFD4', '#F0FFFF', '#F5F5DC', '#FFE4C4', '#000000', '#FFEBCD', '#0000FF', '#8A2BE2', '#A52A2A', '#DEB887', '#5F9EA0', '#7FFF00', '#D2691E', '#FF7F50', '#6495ED', '#FFF8DC', '#DC143C', '#00FFFF', '#00008B', '#008B8B', '#B8860B', '#A9A9A9', '#A9A9A9', '#006400', '#BDB76B', '#8B008B', '#556B2F', '#FF8C00', '#9932CC', '#8B0000', '#E9967A', '#8FBC8F', '#483D8B', '#2F4F4F', '#2F4F4F', '#00CED1', '#9400D3', '#FF1493', '#00BFFF', '#696969', '#696969', '#1E90FF', '#B22222', '#FFFAF0', '#228B22', '#FF00FF', '#DCDCDC', '#F8F8FF', '#FFD700', '#DAA520', '#808080', '#808080', '#008000', '#ADFF2F', '#F0FFF0', '#FF69B4', '#CD5C5C', '#4B0082', '#FFFFF0', '#F0E68C', '#E6E6FA', '#FFF0F5', '#7CFC00', '#FFFACD', '#ADD8E6', '#F08080', '#E0FFFF', '#FAFAD2', '#D3D3D3', '#D3D3D3', '#90EE90', '#FFB6C1', '#FFA07A', '#20B2AA', '#87CEFA', '#778899', '#778899', '#B0C4DE', '#FFFFE0', '#00FF00', '#32CD32', '#FAF0E6', '#FF00FF', '#800000', '#66CDAA', '#0000CD', '#BA55D3', '#9370DB', '#3CB371', '#7B68EE', '#00FA9A', '#48D1CC', '#C71585', '#191970', '#F5FFFA', '#FFE4E1', '#FFE4B5']
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
  //r: 130, g: 90, b: 70
  r: 70, g: 30, b: 20

}

class Shape {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.next = ""
  }
  draw() {
    // const c = cols[randint(cols.length-1)]
    // stroke(c)
    // point(this.x, this.y)
    line(this.x, this.y, this.next.x, this.next.y)
  }
}


async function setNext() {
  const disTreshold = 100 // 0
  for (let src of pointMap.values()) {
    let a = [Infinity]
    for (let targ of pointMap.values()) {
      const d = distanceTo(src, targ)
      if (d < a[0] && d > 0 && !targ.next) a = [d, targ]   

    }
    if(a!=Infinity && a[0] < disTreshold) src.next = a[1]
  }
}

function initShape() {
  pointMap.clear()

  for(let x = scanArea.x0; x < scanArea.xn; x+=1) {
    for(let y = scanArea.y0; y < scanArea.yn; y+=1) {
      const _x = x*pxScale
      const _y = y*pxScale
      // filter out pixels based on location, index
      if(x%detectResolution===0 && y%detectResolution===0) {
        const pixelIndex = (x + y * video.width)*4
        const r = video.pixels[pixelIndex + 0];
        const g = video.pixels[pixelIndex + 1];
        const b = video.pixels[pixelIndex + 2];

        const colorstric = 20
        // filter on color
        if(inRange(r, scanColor.r, colorstric) && inRange(g, scanColor.g, colorstric) && inRange(b, scanColor.b, colorstric) ) { // if r g b all less than 80 then color will appear black
          pointMap.set(coords(_x, _y), new Shape(_x, _y, 0))
        }
      }
    }
  }
  compression1()
  setNext()
  //compressionLines()  
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
  strokeWeight(5)
}

function draw() {
  video.loadPixels()

  if(video.pixels[100] === 0) return log('skip')
  background(255)

  initShape()
  drawScanArea()


  for (let val of pointMap.values()) {
    val.draw()
  }
}