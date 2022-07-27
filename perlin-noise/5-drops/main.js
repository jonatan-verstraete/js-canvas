const noiseSetup = {
    df: 5000,
    zoff: 1,
    scale: 1,
    off() {
        this.zoff += 0.05
    }
}

let imageData = null


function getPxData() {
    clear()
    ctx.drawImage(video, 0, 0, Xmax, Ymax);
    imageData = ctx.getImageData(0, 0, Xmax, Ymax)
    clear()
}


function noisePixels(){
    getPxData()
    const {df, zoff, scale:noiseScale} = noiseSetup


    for(let i=0;i<imageData.data.length;i+=4) {
        const n = noise.perlin3(((i+1)%Xmax)/df,  ((i+1)%Ymax)/df,  zoff)
        imageData.data[i + 0] = imageData.data[i + 0]*n
        imageData.data[i + 1] = imageData.data[i + 1]*n
        imageData.data[i + 2] = imageData.data[i + 2]*n
        imageData.data[i + 3] = imageData.data[i + 3]*n
    }

    ctx.putImageData(imageData, 0, 0);
}

const res = []
let i = 0
for(let x of range(8)) {
    for(let y of range(15)) {
        res.push({x:x, y:y, i:i})
        i++
    }
}
log(res)




async function main() {


    async function animation() {
        clear()
        noisePixels()
        noiseSetup.off()


        await pauseHalt()
        if (!exit) requestAnimationFrame(animation)
    }

    animation()
}

main()