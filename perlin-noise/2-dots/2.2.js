const Main = async()=> {
   const scale = 5
   const df = 190
   const rows = floor(cnv.width / scale)
   const cols = floor(cnv.height / scale)
   const shapeMaxReach = 20
   const shapeWidth = 1
   const shapeData = await getPixels()
   let zoff = 0

   noise.seed(0)
   async function drawFrame() {
      clear()
      let x, y;
      for (x = 0;x < rows; x++) {
         let yoff = 0
         let xoff = 0
         ctx.beginPath();
         for (y = 0; y < cols; y++) {
            let value = noise.simplex3(x / df, y / df, zoff);
            value = (1 + value) * 1.1 * 128;
            let angle = value / ( PI * 2)
            const v = rotateVector(x * scale, y * scale, angle)
            // const inShapeReach = closeTo(x*scale,y*scale, 2, shapeWidth)

            // if(inShapeReach) {
            //    // v.x = 0
            //    // v.y = 0
            //    ctx.stroke()
            //    ctx.beginPath()
               

            //    //point(p.x, p.y, 3, "red")
            //    if(y % 1 == 0) {
            //       //let p = inShapeReach.p
            //       // ctx.fillText(p.deg.totoFixed(0), p.x, p.y)

            //    }

            // }



         ctx.lineTo(x*scale+v.x+xoff, y*scale+v.y+yoff)
         }
         ctx.stroke();
      }
      zoff += 0.005;
      await pauseHalt()
      requestAnimationFrame(drawFrame)
   }



   async function getPixels(xm = Xmid, ym = Ymid, s = 200, centered = true) {
      const shapeSize = 150
      ctx.font= shapeSize+'px verdana';
      const text = "Ubiquity"
      //ctx.lineWidth = shapeWidth
      // await drawImage('eye', 2, shapeSize/100)
      const scanArea = {
         x0: xm - (text.length * shapeSize * 0.263),
         y0: ym - shapeSize,
         xn: shapeSize + (text.length * shapeSize * 0.47),
         yn: shapeSize + shapeSize * 0.44
      }
      ctx.fillText(text, scanArea.x0,scanArea.y0+shapeSize)

      const res = new Map()
      const imgData = ctx.getImageData(scanArea.x0,scanArea.y0,scanArea.xn,scanArea.yn);
      const data = arrayChuck([...imgData.data], 4)
      let idx = 0
      for (let y = 0; y < imgData.height; y += 1) {
         for (let x = 0; x < imgData.width; x += 1) {
            let cData = data[idx] || []
            if(cData[3] > 10) {
                  res.set(sCoord(toFixed(scanArea.x0+x),toFixed(scanArea.y0+y)), {
                     x: toFixed(scanArea.x0+x),
                     y: toFixed(scanArea.y0+y),
                     a: cData[3]  / ( PI * 2 * 255),
                     cl: cData[3],
                     deg: ((res.size /ctx.lineWidth / (shapeSize * PI * 4)) * 360) / 1.8
                  })
            }
            idx += 1
         }
      }
      clear()
      return res
   }

   function closeTo(x, y, reach = 1, s = 1) {
      if(!shapeData) return ctxError("no shapeData")
      for(let i =1; i < reach; i+= 1) {
         const dir = getNieghboursByDimension(reach, x, y, s)
         for(let j of dir) {
            let cp = shapeData.get(sCoord(j[0], j[1]))
            if(cp) {
               return {dis: i, p: cp}
            }
         }      
      }
      return false
   }
   drawFrame()
}

Main()