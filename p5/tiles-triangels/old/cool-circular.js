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

const scale = 80
let cols = null
let rows = null

const pointMap = []

function validateLine(i) {
  if (i.x > width || i.x < 0 || i.y > height || i.y < 0) return false
  return true
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = ceil(width / scale)
  rows = ceil(height / scale)
  noiseSeed(10);
  rectMode(CENTER)
}

function draw() {
  background(255)
  noLoop()
  let lastTriangle = [200,200, 200, 200]

  for (let y = 0; y < height; y += scale) {
    for (let x = 0; x < width; x += scale) {

      const w = scale
      const rot = randint(360)
      const v = p5.Vector.fromAngle(radians(rot), w);

      stroke(150);
      const {0:a, 1:b, 2:c, 3:d, 4:r}=lastTriangle
      lastTriangle=[c+v.x, d+v.y, c, d, rot]
      if(a==200) continue

      push();
      beginShape();
      translate(a, b);

      vertex(a, b)
      vertex(a+v.x, b+v.y)
      vertex(c, d)
      vertex(a, b)

      endShape();

      pop();

    }
  }
}