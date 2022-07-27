let t;
let framecount = 1
const roughness = 0.004
const noiseSpread = 0.0005

function setup() {
  createCanvas(800, 800);
  background(255);
  stroke(0, 100);
  noFill();
  t = 0;
}


function getSurface(x, y) {
   area = 0;
   for(i = 0; i < N; i += 2 ) {

   }
   area += x[i+1]*(y[i+2]-y[i]) + y[i+1]*(x[i]-x[i+2]);
   area /= 2;
}
const loopamt = 4000
let rads = {}


async function draw() {
   fill('#ffffff00')
   rect(0, 0, width, height)
   fill('#fff')
   translate(width/2, height/2);
   rotate(framecount/1000)
   beginShape();
   curveTightness(100);
   //clear()
   for (let i = 0; i < 200; i++) {
      let ang = map(i, 0, 200, 0, TWO_PI);
      let rad = ((loopamt-framecount)/100)+(400-(framecount/10)) * noise(i * roughness, t * noiseSpread);
      if(rads[i]) {
         //console.log(rads[i], rad)
         if(rads[i] < rad) {
            rad = rads[i]
         }
      }
      rads[i] = rad
      let x = rad * cos(ang);
      let y = rad * sin(ang);
      curveVertex(x, y)
   }
   endShape(CLOSE);
   //rotate(-framecount/1000)
   if(framecount%loopamt===0) {
      return console.warn('-- done --')
   }
   framecount+=1
   t += 1;
}