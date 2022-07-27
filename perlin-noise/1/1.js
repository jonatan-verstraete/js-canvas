
window.onload =  async ()=> {
    const Perlin = new PerlinNoise()

    const GRID_SIZE = 4;
    const RESOLUTION = 50;
    const COLOR_SCALE = 360;

    let pixel_size = cnv.width / RESOLUTION;
    let num_pixels = GRID_SIZE / RESOLUTION;
    const inc = num_pixels / GRID_SIZE

    const imageData = ctx.createImageData(cnv.width, cnv.height);
    const newPxData = await animate()
   
    //await sleep(1)
    // putNewData(newPxData)

    function putNewData(newData) {
        clear()
        let idx= 0
        for (let i = 0; i < imageData.data.length; i += Math.floor((imageData.data.length / newData.length)) ) {
            let a = newData[idx]
            if(a) {
                imageData.data[i + 0] = a[0];
                imageData.data[i + 1] = a[1];
                imageData.data[i + 2] = a[2];
                imageData.data[i + 3] = 255; 
            }
            idx ++
        }
        ctx.putImageData(imageData, 0, 0);
    }


    async function animate(XN = 0, YN = 0) {
        const res = []
        return new Promise((resolve, reject)=> {
            for (let y = 0; y < GRID_SIZE; y += inc) {
                for (let x = 0; x < GRID_SIZE; x += inc) {
                    let v = parseInt(Perlin.get(x+ XN, y+ YN,) * COLOR_SCALE);
                    res.push(hslTo(v, 50, 50))
                    ctx.fillStyle = `hsl(${v}, ${40}%, ${50}%)` // colorManager(v, false) // `hsl(${v}, ${40}%, ${50}%)`
                    ctx.fillRect(
                        x / GRID_SIZE * cnv.width,
                        y / GRID_SIZE * cnv.width,
                        pixel_size,
                        pixel_size
                    );
                }
            }
            resolve(res)
        })
    }


    return

    for (let y = 0; y < 0.01; y += inc) {
        for (let x = 0; x < 0.1; x += inc) {
            clear()
            await animate(x * 10, y)
            await sleep(1)
            await pauseHalt()
        }
    }
    
}      


/**


    // for (let i = 0; i < imageData.data.length; i += 4) {
    //     // Modify pixel data
    //     let a = newData[i]
    //     if(a) {
    //         imageData.data[i + 0] = a[0];  // R value
    //         imageData.data[i + 1] = a[1];  // G value
    //         imageData.data[i + 2] = a[2];  // B value
    //         imageData.data[i + 3] = 255;  // A value
    //     }

    // }




 */