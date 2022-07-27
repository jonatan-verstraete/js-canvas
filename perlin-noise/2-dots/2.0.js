// const Noise = new PerlinNoise()
// let xoff = 100
// let yoff = 10

// function animate() {
//     clear()
//     requestAnimationFrame(animate)
//     square(Noise.get(xoff, yoff) * 10, Noise.get(xoff, yoff) * 10, 10)
//     xoff += 0.01
//     log(Noise.get(xoff, yoff))
// }

// animate()

const image = ctx.createImageData(cnv.width, cnv.height)
const shapeData = getShapeData()
const data = image.data
const cWidth = cnv.width;
const iWidth = image.width;
const iHeigth = image.height;
const shapeDiverse = 200
let height = 0

async function drawFrame() {
   for (let x = 0; x < iWidth; x++) {
      for (let y = 0; y < iHeigth; y++) {
         let value = noise.simplex3 (x / 50, y / 50, height);
         value = (1 + value) * 1.1 * 128;
         let cell = (x + y * cWidth) * 4;

         if (shapeData.has(x + ":" + y)) {
            if (data[cell + shapeDiverse]) cell += shapeDiverse
         }
         data[cell] = data[cell + 1] = data[cell + 2] = value;
         data[cell + 0] = 120
         data[cell + 3] = 255;
      }
   }
   height += 0.05;
   await pauseHalt()
   ctx.putImageData(image, 0, 0);
   requestAnimationFrame(drawFrame)
   return
}

function getShapeData() {
   const res = new Map()
   ctx.lineWidth = 20
   let s = 200
   let s2 = s / 2
   ctx.rect(Xmid - s2, Ymid - s2, s, s)

   // ctx.rect(Xmid - s2 /2, Ymid - s2 /2, s2, s2)
   ctx.stroke()
   const image = ctx.getImageData(Xmid - s2, Ymid - s2, s, s)
   let idx = 0

   for (let x = 0; x < image.width; x++) {
      for (let y = 0; y < image.height; y++) {
         if (image.data[idx + 3] == 255) {
            res.set(`${Xmid - s2 + x}:${Ymid - s2 + y}`, true)
         }
         idx += 4
      }
   }
   clear()
   return res
}
drawFrame()