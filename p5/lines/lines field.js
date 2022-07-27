const noiseAmt = 50
let frames = 0
const gridSize = 30
const tsx = 20
const tsy = 20



function setup() {
   createCanvas(window.innerWidth, window.innerHeight, WEBGL);
   setAttributes('antialias', true);
   noiseSeed(99);

   strokeWeight(1);
   background(200);

}

function draw() {
   fill('#0000');
   clear()
   // translate(350, -50)
   // rotateZ(3.14);
   // rotateX(1.7);

   translate(-350, -50)
   rotateX(1.3)
   ngon();
   frames+=0.01
}


function ngon() {
  for(let x = 0; x < gridSize; x++) {
   beginShape();
   for(let y = 0; y < gridSize; y++) {
      const ang = map((x+y), 0, (gridSize**2), 0, TWO_PI)/10
      const rad = noiseAmt * noise(x+frames, y+frames);
      const px = rad * cos(ang);
      const py = rad * sin(ang);

      curveVertex(x*tsx+px, y*tsy+py)
      //curveVertex(y*20+py, x*30+px)

   }
   endShape();
  }
  for(let x = 0; x < gridSize; x++) {
   beginShape();
   for(let y = 0; y < gridSize; y++) {
      const ang = map((x+y), 0, (gridSize**2), 0, TWO_PI)/10
      const rad = noiseAmt * noise(x+frames, y+frames);
      const px = rad * cos(ang);
      const py = rad * sin(ang);

      curveVertex(y*tsy+py, x*tsx+px)

   }
   endShape();
  }
}
