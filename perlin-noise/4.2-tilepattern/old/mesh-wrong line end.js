/*
CONCEPT:

1.
  sort all points in groups of 4
  connect the 1st with 2 random of 4 to forme triangle
  4th left point is beginning of new shape

  Problem:
  - some points will be left without possible connection
    -> Not if the the last point forms a triangle with the next woo point, no more random, only the first twoo points
*/

const scale=50
const cols = ceil(Xmax/scale)
const rows = ceil(Ymax/scale)

const pointMap = []

const setup = {
  noise: {
    df: 1500,
    zoff: 0,
    zoffAmount: .003,
  }
}

function formTriangle(a, b, c, cl) {
  if(!a || !b || !c) return log('-')
  ctx.fillStyle = cl
  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.lineTo(b.x, b.y)
  ctx.lineTo(c.x, c.y)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}



const main= ()=> {
  for(let y=0; y<Ymax; y+=scale) {
    const row=[]
    for(let x=0; x<Xmax; x+=scale) {
      const {df, zoff} = setup.noise
  
      const value = noise.perlin3(x/df,  y/df ,  zoff)
      const angle = ((1 + value) * 1.1 * 128) / (PI * 2)
      const v = rotateVector(x, y, angle)
  
      row.push( {x:x+v.x, y:y+v.y} )
    }
    pointMap.push(row)
  }
  
  
  for(let i of pointMap) {
    point(i.x, i.y, 10, "gray")
  }

  for(let j in range(cols)) {
    for(let i in range(rows)) {

      if(!pointMap[i] || !pointMap[i+1] || !pointMap[i][j] || !pointMap[i+1][j] || !pointMap[i][j+1] || !pointMap[i+1][j+1] ) {
        log('-')
        continue 
      } 
      formTriangle(pointMap[i][j], pointMap[i][j+1], pointMap[i+1][j], "#4f45")
  
    }
  }
}


main()