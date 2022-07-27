
const image = ctx.createImageData(cnv.width, cnv.height)
const data = image.data
const cWidth = cnv.width
const iWidth = image.width
const iHeigth = image.height
let noiseOff = 0
const contrast = 1
const noiseScale = 800
const noiseSpeed = 0.001
let zoomlvl = 1

const sc = 15



function rotateX(x, y) {
   var rd, ca, sa, ry, rz, f;

   let value = noise.simplex3 (x/noiseScale, y/noiseScale, noiseOff)
           
   // const angle = ((1 + value) * 1.1 * 128) / (PI * 2)
   // const v = rotateVector(x, y, angle)
   // x += v.x
   // y += v.y



   rd = angle * Math.PI / 180; /// convert angle into radians
   ca = Math.cos(rd);
   sa = Math.sin(rd);

   ry = y * ca;   /// convert y value as we are rotating
   rz = y * sa;   /// only around x. Z will also change

   /// Project the new coords into screen coords
   f = fov / (viewDist + rz);
   x = x * f + w;
   y = ry * f + h;
   return [x, y];
}

async function drawFrame() {
   for (let x = 0; x < iWidth; x+=sc) {
      for (let y = 0; y < iHeigth; y+=sc) {
         let value = noise.simplex3 (x/noiseScale, y/noiseScale, noiseOff)
         value = (1 + value) * 1.1 * (180 * contrast)
         value += (360/iHeigth) * y


         rect(x-sc, y-sc, x+sc, y+sc, null, hsl(value))
      }
   }
   noiseOff += noiseSpeed
   await pauseHalt()
   requestAnimationFrame(drawFrame)
}


drawFrame()
