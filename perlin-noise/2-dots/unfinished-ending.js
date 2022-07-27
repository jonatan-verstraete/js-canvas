const scale = 10
const df = 60
const rows = floor(cnv.width / scale)
const cols = floor(cnv.height / scale)
const particles = new Array(200)
const flowfield = new Array(cols * rows)
let zoff = 0

function setup() {
   for(let i = 0; i < particles.length; i++) {
      particles[i] = new Particle()
   }
}

async function drawFrame() {
   clear()
   ctx.beginPath();
   for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
         let value = noise.simplex3(x / df, y / df, zoff);
         value = (1 + value) * 1.1 * 128;
         const angle = value / ( PI * 2)
         const v = rotateVector(x * scale, y * scale, angle)
         // ctx.strokeStyle = "#00000022"
         ctx.lineTo( x * scale + v.x, y * scale + v.y)
         // linex * scale, y * scale, x * scale + v.x, y * scale + v.y)
         v.xs = x * scale
         v.ys = y * scale

         //let idx = x + y * cols
         // flowfield[idx] = v
      }
   }
   ctx.stroke();

   // for(let i = 0; i < particles.length; i++) {
   //    let _x = floor(particles[i].pos.x / scale)
   //    let _y = floor(particles[i].pos.y / scale)
   //    const _idx = flowfield[_x + _y + cols]

   //    ///log(i, _idx, particles[i].pos.x , particles[i].pos.y)

   //    particles[i].applyForce(_idx)
   //    particles[i].render()

   // }


   zoff += 0.005;

   await pauseHalt()
   requestAnimationFrame(drawFrame)
   return
}


setup()
drawFrame()
