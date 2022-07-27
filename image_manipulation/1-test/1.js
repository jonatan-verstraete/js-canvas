// loads image



function copy() {
    let imgData = ctx.getImageData(100, 100, 50, 50);
    console.log(imgData)
    ctx.putImageData(imgData, 10, 70);
}


function loadImg() {
    const img = new Image();
    img.src = "../images/img1.jpg";

    img.onload = function () {
        cnv.width = img.width
        cnv.height = img.height

        ctx.drawImage(img,0,0);
        restructure()

    }
}

loadImg()

async function restructure() {
    const ctx2 = document.createElement('canvas').getContext('2d')
    const d = {}
    const size = 40
    log(cnv.height, cnv.width)

    for(let y = size; y < cnv.height; y+= size) {
        for(let x = size; x < cnv.width; x+= size) {

        
            const imgD = ctx.getImageData(x, y, size, size);
            const rx = cnv.width - x  //randint(Xmax)
            const ry = cnv.height - y //randint(Ymax)

            log(x, y, rx, ry)

            ctx.putImageData(imgD, rx, ry);


            // ctx.beginPath()

            // ctx.moveTo(x, y)
            // ctx.lineTo(rx, ry)

            // ctx.stroke()

            await sleep(0.001)

        }
    }
}





