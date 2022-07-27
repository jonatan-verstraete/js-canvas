const noiseSpread = {
   x: 5,
   y: 0.5,
   xm: -5,
   ym: 0
}
// def 10. how many shapes (iterated with depthdetail steps)
const depth = 3     
// def 0.01. how many steps are in between the shapes. quality  
const depthDetail = 0.05
// def 10. its deviding tbe radius of the light source
const startRadius = 3      // def 10

const Cave ={x:0, y:0}

let zoff = 0;
let doff = 0
const inc = 0.02



function setup() {
   createCanvas(windowWidth, windowHeight);

   background(255);
   stroke(0, 100);
   noFill();
   noiseSeed(10);
   Cave.x = windowWidth/2
   Cave.y = windowHeight/2

	colorMode(HSB, 360, 100, 100, 100);
   background(0);
   strokeWeight(20)
   noFill()
}

function draw() {

   //clear()
   rotate
   translate(width / 2, height / 2);

   const {x:cx, y:cy }= Cave
   for(let d = 0; d < depth; d += depthDetail) {
      //rotate(d/100);

      beginShape();
      const noiseoff = d + doff 
      let lp = {}


      for (let a = 0; a < TWO_PI; a += 0.04) {
         let xoff = map(cos(a), -1, 1, noiseSpread.xm, noiseSpread.x);
         let yoff = map(sin(a), -1, 1, noiseSpread.ym, noiseSpread.y);
         const r = map(noise(xoff, yoff,noiseoff), 0, 1, 100, 250) * d/startRadius
         let x = r * cos(a);
         let y = r * sin(a);

         vertex(x, y);
         lp={x:x, y:y}
      }
      const dis = dist(lp.x, lp.y, cx, cy)
      const c = map(dis, 0, dis*(d), 0, 100)
      stroke(0, 0, c)
      //stroke(c, 100, c)

      endShape();
   }
   doff -= inc
}