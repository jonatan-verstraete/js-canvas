const scale = 5
const df = 290
const rows = floor(cnv.width / scale)
const cols = floor(cnv.height / scale)
let zoff = 0

const preferdShape = ["triangle", "circle", "lines"][2]
const effect = ["none", "cilindershades", "mirror", "water"][0]
const colored = false
const ExtraLineLength = 0
const speed = 0.005 //0.005

ctx.invert()
ctx.lineWidth = .9
// ctx.blur(2)
//ctx.shade()
const randomsA = rangeF(()=>randint(20), rows*cols*2)

async function V1() {
   clear()
   for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
         let value = noise.simplex3(x/df, y/df, zoff);
         value = (1 + value)*1.1*128;
         const angle = value / ( PI * 2)
         const v = rotateVector(x * scale + ExtraLineLength, y * ExtraLineLength  +1000, angle)

         if(colored) {
            ctx.strokeStyle = `hsl(${angle * (360 / 50)}, 50%, 50%)`
            ctx.fillStyle = `hsl(${angle * (360 / 50)}, 50%, 50%)`
         }
         switch(effect) {
            case "none":             
               break;
            case "cilindershades":
               v.x *= tanh(v.x)
               v.y *= sinh(v.y)               
               break;
            case "mirror":
               v.x *= sin(x)
               v.y *= cos(y)              
               break;
            case "water":
               v.x = randint(5) + (sin(v.x) - sin(x))*5
               v.y = randint(5) + (cos(v.y) - cos(y))*5           
               break;
            default:
               textCenter("EFFECT NOT FOUND",40)
               return
         }
         switch(preferdShape) {
            case "triangle":
               triangle(x*scale, y*scale, (v.x-v.y) / 4,{rotate:360-(angle*(360/50)), filled:true, sharpness:2})
               break;
            case "circle":
               circle(x*scale, y*scale, (v.x - v.y)*0.3)//, "white"
               break;
            case "lines":
               //line(x*scale, y*scale, x*scale+v.x,  y*scale+v.y, "#000000aa")
               line(x*scale-randomsA[x+y-1], y*scale-randomsA[x+y], x*scale+v.x+randomsA[x+y],  y*scale+v.y+randomsA[x+y+1], "#aaaaaa20")         
               //line(x*scale, y*scale, x*scale+v.x,  y*scale+v.y, "#00000022")
               break;
            default:
               textCenter("SHAPE NOT FOUND",40)
               return
         }
      }
   }
   zoff += speed;
   await pauseHalt()
   requestAnimationFrame(V1)
}

async function V2() {
   clear()
   let x, y;
   for (x = 0;x < rows; x++) {
      ctx.beginPath();
      for (y = 0; y < cols; y++) {
         let value = noise.simplex3(x / df, y / df, zoff);
         value = (1 + value) * 1.1 * 128;
         const angle = value / ( PI * 2)

         const v = rotateVector(x * scale, y * scale, angle)
         ctx.lineTo( x * scale + v.x, y * scale + v.y)
      }
      //ctx.lineTo(x * scale, Ymax + y)
      ctx.stroke();
   }
   zoff += 0.005;
   await pauseHalt()
   requestAnimationFrame(V2)
   return
}

async function test() {
   clear()
   let x, y;
   for (x = 0;x < rows; x++) {
      ctx.beginPath();
      for (y = 0; y < cols; y++) {
         let value = noise.simplex3(x / df, y / df, zoff);
         value = (1 + value) * 1.1 * 128;
         const angle = value / ( PI * 2)
         const v = rotateVector(x * scale, y * scale, angle)
         const vn = rotateVector(x * scale / 2, x * scale/2, angle * 1.2)


         v.x = vn.x  - tan(v.x)
         v.y = vn.y  * sin(v.y)

         ctx.lineTo( x * scale + v.x, y * scale + v.y)
      }
      ctx.lineTo(x * scale, Ymax + y)
      ctx.stroke();
   }
   zoff += 0.005;
   await pauseHalt()
   requestAnimationFrame(test)
   return
}

V1()