const scale=50
let lastAngle = 90


const pos = {
  x: 0,
  y: 0,
}

for(let i=0; i<Xmax; i+=scale) {
  for(let j=0; j<Ymax; j+=scale) {
    let v;
    let cx = pos.x
    let cy = pos.y
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    v = rotateVector(cx+scale, cy, randint(10, 90))
    cx+= v.x
    cy+= v.y
    ctx.lineTo(cx, cy)
    v = rotateVector(cx+scale, cy, randint(10, 90))
    cx+= v.x
    cy+= v.y
    ctx.lineTo(cx, cy)
    ctx.closePath()
    ctx.stroke()
    pos.x=cx
    pos.y=cy
    log(pos)
  }
}
