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

  // markPoint(a.x, a.y, 10, {stroke: "green"})
  // markPoint(b.x, b.y, 10, {stroke: "blue"})
  // markPoint(c.x, c.y, 10, {stroke: "red"})
}

for(let y=0; y<Ymax; y+=scale) {
  for(let x=0; x<Xmax; x+=scale) {
    const {df, zoff} = setup.noise

    const value = noise.perlin3(x/df,  y/df ,  zoff)
    const angle = ((1 + value) * 1.1 * 128) / (PI * 2)
    const v = rotateVector(x, y, angle)

    pointMap.push( {x:x+v.x, y:y+v.y} )
  }
}


for(let i of pointMap) {
  point(i.x, i.y, 10, "gray")
}

let idx0 = 0
let idxN = cols
const pts = arrayChuck(pointMap, 4)

for(let col of range(cols)) {
  for(let row of range(rows)) {
    if(idx0 && idx0%(cols-col-1)==0) {
      idxN+=1
      idx0+=1
      continue
    }
    formTriangle(pointMap[idx0], pointMap[idxN], pointMap[idxN+1], "#4f45")
    formTriangle(pointMap[idx0], pointMap[idx0+1], pointMap[idxN+1], "#f445")

    idxN+=1
    idx0+=1
  }
}
