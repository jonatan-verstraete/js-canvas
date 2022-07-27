
const imgsPath = "../images/"

const imgsA = {
    face1: imgsPath+ "face1.png",
    bg1: imgsPath+"img1.png",
}

async function loadImg() {
    const img = new Image();
    img.src = imgsA.face1;


    img.onload = async () => {
        await sleep(0.1)
        cnv.width = img.width
        cnv.height = img.height
        ctx.drawImage(img,0,0);


        const imgData2 =  ctx.getImageData(0,0, cnv.width, cnv.height);
        const contrasted2 = contrastImage(imgData2, 100)
        ctx.putImageData(contrasted2, 0, 0);


        const b = shuffleArray(await getImgPixels());



        return
        clear()
        ctx.strokeStyle = `hsla(0,0%,50%,${0.2})`;
        ctx.lineWidth = 1

        for(let z = 0; z < 1; z++) {
            clear()
            b.forEach((p, idx, arr)=> {
                let prev =  arr[idx - 1] || {x:0, y: 0}

                line(prev.x, prev.y, p.x, p.y)
                // ctx.fillStyle = p.cl
                // square(p.x, p.y, 2, 2)
            })
            await pauseHalt()
            await sleep(0.1)
        }




        // b.forEach(p=> {
        //     square(p.x, p.y, 1, p.cl)
        // })

        // const imgData =  ctx.getImageData(0,0, cnv.width, cnv.height);
        // const contrasted = contrastImage(imgData, -10000)
        // console.log(contrasted2)
        // ctx.putImageData(contrasted, 0, 0);
    }
}

loadImg()
