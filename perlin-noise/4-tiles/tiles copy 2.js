
const image = ctx.createImageData(cnv.width, cnv.height)
const data = image.data
const cWidth = cnv.width
const iWidth = image.width
const iHeigth = image.height
let noiseOff = 0
const contrast = 1
const noiseScale = 700
let zoomlvl = 1

const sc = 25

let fov = 212,         /// Field of view kind of the lense, smaller values = spheric
viewDist = 200,     /// view distance, higher values = further away
w = cnv.width / 2,  /// center of screen
h = cnv.height / 2,
angle = 68,       /// grid angle
i, p1, p2;         /// counter and two points (corners)

let px = py = 0;



function rotateX(x, y) {
   var rd, ca, sa, ry, rz, f;
   x += px
   y += py

   let value = noise.simplex3 (x/noiseScale, y/noiseScale, noiseOff/10)
           
   const angle = ((1 + value) * 1.1 * 128) / (PI * 2)
   const v = rotateVector(x, y, angle)
   x += v.x
   y += v.y



   rd = angle * Math.PI / 180; /// convert angle into radians
   ca = Math.cos(rd);
   sa = Math.sin(rd);

   ry = y * ca;   /// convert y value as we are rotating
   rz = y * sa;   /// only around x. Z will also change

   /// Project the new coords into screen coords
   f = fov / (viewDist + rz);
   x = x * f + w;
   y = ry * f + h;
   return [x-Xmid, y-Ymid];
}

async function drawFrame() {
   clear()
   for (let x = 0; x < iWidth; x+=sc) {
      for (let y = 0; y < iHeigth; y+=sc) {
         let value = noise.simplex3 (x/noiseScale, y/noiseScale, noiseOff)
         value = (1 + value) * 1.1 * (180 * contrast)
         value += (360/iHeigth) * y

         let p = rotateX(x, y)

         square(p[0], p[1], sc, null, hsl(value))
      }
   }
   noiseOff += 0.01
   await pauseHalt()
   requestAnimationFrame(drawFrame)
}
drawFrame()



window.onkeydown = (ev)=> {
   if(ev.key == 'ArrowDown') {
       py++
   } else  if(ev.key == 'ArrowUp') {
       py--
   } else if(ev.key == 'ArrowLeft') {
      px++
  } else  if(ev.key == 'ArrowRight') {
      px--
  }
}