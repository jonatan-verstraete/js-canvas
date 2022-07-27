let terrainValues = [];
let mult = 300;
let xoff = 0;
let yoff = 100;
let inc = 0.0001;

function setup() {
   createCanvas(900, 500, WEBGL);
   angleMode(DEGREES);


}

function draw() {
   terrainValues = []
   for (let y = 0; y < 60; y++) {
      terrainValues.push([]);
      xoff = 0;
      for (let x = 0; x < 60; x++) {
         terrainValues[y][x] = map(noise(xoff, yoff), 0, 1, -mult, mult);
         xoff += inc*100;
      }
      yoff += inc;
   }

   background(0);

   stroke(255);
   strokeWeight(0.5);
   noFill();
   translate(200, -100)
   rotateX(65);
   translate(-width / 2, -height / 2);
   for (let y = 0; y < 60; y++) {
      beginShape(TRIANGLE_STRIP);
      for (let x = 0; x < 60; x++) {
         curveVertex(x * 10, y * 10, terrainValues[y][y]);
         curveVertex(x * 10, (y + 1) * 10, terrainValues[y][x]);
      }
      endShape();
   }
}