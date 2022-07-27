
const image = ctx.createImageData(cnv.width, cnv.height)
const data = image.data
const cWidth = cnv.width
const iWidth = image.width
const iHeigth = image.height
let noiseOff = 0
const contrast = 1
const noiseScale = 920
let zoomlvl = 600


async function drawFrame() {
   for (let x = 0; x < iWidth; x++) {
      for (let y = 0; y < iHeigth; y++) {
         let value = noise.simplex3 (x/noiseScale, y/noiseScale, noiseOff + cos(x*y*zoomlvl) + tan((y+x)/100))
         value = (1 + value) * 1.1 * (128 * contrast)
         let cell = (x + y * cWidth) * 4


         data[cell + 0] = (255/iWidth) * x
         // data[cell + 1] = (255/iHeigth) * y
         // data[cell + 0] = 100
         data[cell + 1] = value-50
         data[cell + 2] = value+50 
         data[cell + 3] = value
      }
   }
   ctx.putImageData(image, 0, 0)
   noiseOff += 0.1
   requestAnimationFrame(drawFrame)
}


drawFrame()
