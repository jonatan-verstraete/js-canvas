const VIEW = {
    // bool. stroke or filled
    filled: true,
    /*
    int 0-4
    v1:
      0: ant is square with head , avg time: 10.2 ms
      1: body, legs 
      2: +jaws and receptors
      4: receptors work on noise value, and +eyes based on noise. avg time: 318.7 ms
    v2:
      0: same
      1: simple ant
    */

    detail: 1, 
    //float. def 1. the size of shapes, zoom
    size: 1, 
    // shows how much resources there are at a place
    stats: true,
    DEV: false,
}

const SETUP = {
    noise: {
      df: 55.2,
      zoff: 0.1,
      zoffAmount: 0.02,
    }
}

const GRID= {
  detail: 13,
  map: new Map(),
  values:[],
  decayCount: 0,
  init() {
    for(let x=0;x<Xmax;x++) {
      for(let y=0;y<Ymax;y++) {
        if(x%this.detail===0 && y%this.detail===0 ) {
          this.map.set(sCoord(x, y), {
            pheromone: 0,
            food: 0,
            pheromoneOrientation: null,
            x:x,
            y:y,
            id: sCoord(x, y),
          })
          this.values.push({x:x, y:y})
        }
      }
    }
  },
  decayScent() {
    if(this.decayCount == 30) {
      this.decayCount = 0
      for(let i of this.map.values()) {
        if(i.pheromone>0) i.pheromone -= 0.1
        else if(i.pheromone<0) {
          i.pheromoneOrientation = null
          i.pheromone = 0
        }
      }
    } else {
      this.decayCount += 1
    }
  },
  show(showAll) {
    for(let [k, v] of this.map.entries()) {
      if(showAll) point(v.x, v.y, this.detail/2,  v.food ? hsl(120, 50, numMax(v.food*20, 50)) : (v.track ? hsl(45, 28, v.track*10): "#8f7f50"))
      else point(v.x, v.y, this.detail/2,  v.food ? hsl(120, 50, numMax(v.food*20, 50)) : (v.track ? hsl(45, 28, v.track*10): null))
      if(VIEW.stats) {
       
        if(v.food) {
          ctx.fillStyle = "green"
          fillText(floor(v.food), v.x+10, v.y)
        }
        if(v.pheromone)  {
          ctx.fillStyle = "darkblue"
          fillText(toFixed(v.pheromone, 1), v.x+10, v.y+10)
        }
        if(v.pheromoneOrientation)  {
          ctx.fillStyle = "yellow"
          fillText(toFixed(v.pheromoneOrientation, 1), v.x+10, v.y+20)
        }
      }
    }
  },
  getClosest(x, y) {
    const p = {x:floor(x), y:floor(y)}
    let res = [Infinity]
    for(let _x of range(this.detail*2).map(i=>p.x+i-this.detail)) {
      for(let _y of range(this.detail*2).map(i=>p.y+i-this.detail)) {
        if( _x % this.detail===0 && _y % this.detail===0 ) {
          const d = distanceTo(p, {x:_x, y:_y})
          if (d < res[0]) res = [d, {x:_x, y:_y}]
        }
      }
    }
    return this.map.get(sCoord(res[1].x, res[1].y))
  },
  getPointsInRange(x, y, r) {
    const res= []
    for(let _x of range(r*2).map(i=>x+i-r)) {
      for(let _y of range(r*2).map(i=>y+i-r)) {
        
        if( _x % this.detail===0 && _y % this.detail===0 ) {
          if ((_x-x)**2 + (_y-y)**2 <= r**2) {
            res.push(this.map.get(sCoord(_x, _y)))
          }
        }
      }
    }
    return res
  },
}

const COLORS = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
'#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
'#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
'#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
'#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
'#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
'#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
'#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
'#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
'#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']




const CONSTS = {
    // multiply this number by GRID.detail and you will always outcome the same number as the distance toa point
    "grid": 1.41425
}

  
function checkPoint(x, y, radius, startAngle) {
  let percent = 12
  const endAngle = 360 / percent + startAngle 
  const polarradius = sqrt(x * x + y * y) 
  const Angle = atan(y / x) 

  if (Angle >= startAngle && Angle <= endAngle && polarradius < radius) return true
}
  

  



function areClockwise(a, b) {
  return -a.x*b.y + a.y*b.x > 0
}






info("detail level:", VIEW.detail)
