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
    df: 150,
    zoff: 1000,
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
function getPoints(x, y){
  const {df, zoff} = setup.noise
  const value = noise.perlin3((2000+x)/df,  (2000+y)/df ,  zoff)
  const angle = ((1 + value) * 1.1 * 128) / PI2
  const v = rotateVector(x, y, angle)
  return {x:x+v.x, y:y+v.y}
}

const main = async()=> {
  for(let y=0; y<Ymax; y+=scale) {
    for(let x=0; x<Xmax; x+=scale) {
      const w = scale
      formTriangle(getPoints(x, y), getPoints(x+w, y), getPoints(x, y+w), "#4c4")
      formTriangle(getPoints(x+w, y+w), getPoints(x+w, y), getPoints(x, y+w), "#F44")
      await sleep(0.01)
    }
  }
  setup.noise.zoff += setup.noise.zoffAmount
}

async function animate() {
  clear()
  await main()
  await pauseHalt()
  requestAnimationFrame(animate)
}
animate()
