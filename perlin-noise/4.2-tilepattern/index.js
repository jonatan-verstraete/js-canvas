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
    zoffAmount: .03,
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

function getDis(a, b, c){
  const x = (a.x + b.x + c.x)/3
  const y = (a.y + b.y + c.y)/3
  return distanceTo({x:x, y:y}, {x:Xmid, y:Ymid})

}

const main = async()=> {
  const pts = []
  for(let y=0; y<Ymax; y+=scale) {
    for(let x=0; x<Xmax; x+=scale) {
      const w = scale

      const a = [getPoints(x, y), getPoints(x+w, y), getPoints(x, y+w)]
      const b = [getPoints(x+w, y+w), getPoints(x+w, y), getPoints(x, y+w)]
      const disa = getDis(...a)
      const disb = getDis(...b)

      pts.push([...a, hsl(0, 50, mapNums(disa, 0, 1000, 0, 100)), disa])
      pts.push([...b, hsl(200, 50, mapNums(disa, 0, 1000, 0, 100)), disb])
    }
  }
  pts.sort((a, b)=> a[4]-b[4])
  for(let i of pts) {
    await sleep(0.001)
    formTriangle(...i)
  }
}

async function animate() {
  //clear()
  //rect(0, 0, Xmax, Ymax, null, "#fff5")
  main()
  await sleep(1)
  await pauseHalt()
  setup.noise.zoff += setup.noise.zoffAmount
  requestAnimationFrame(animate)
}
animate()
