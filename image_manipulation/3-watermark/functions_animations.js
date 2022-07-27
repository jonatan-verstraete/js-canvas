class ImgMarker {
    constructor() {
        this.pattern = [[1, 24],[87, 284],[24, 59],[38, 1],[11, 187]]
        this.posX = 0
        this.posY = 0
        this.W = 1
        this.H = 1
        this.padd = 0
        this.pxsize = 1
        this.targetColor = 255

    }

    setPixel(x, y) {
        ctx.fillStyle = "#" + toHex(this.targetColor) + "0000"
        ctx.fillRect(x, y, this.pxsize , this.pxsize )
        return
    }

    getPixel(x, y, size = 1, {show = true} = {}) {
        ctx.fillStyle = "red"
        if(show) ctx.fillRect(x -size / 2, y -size / 2, size + 2, size + 2)
        return ctx.getImageData(x, y, 1, 1).data
    }



    async valiedateImg(pattern) {
        const data = await this.getPixels()
        console.log("pattern", pattern)
        console.log("data", data)

        console.log(reversedScaleCoords(data, this.W, this.H))
    }


    setPattern(pattern, W, H, showArea = true){
        let padd = 10, size = (W + H) / 15;
        this.pattern = pattern
        this.W = W
        this.H = H
        this.padd = padd

        // square(padd, padd, size, "green")
        // clear(size - padd, size - padd, size / 2, size / 2)

        this.pattern.map(i=>this.setPixel(...i))
        if (showArea) {
            ctx.rect(this.padd, this.padd, this.W,  this.H)
            ctx.stroke()
        }
    }

    async getPixels() {
        const res = []
        const imgData = ctx.getImageData(this.padd, this.padd, this.W,  this.H);
        const data = arrayChuck([...imgData.data], 4)

        let idx = 0
        for (let y = 0; y < imgData.height; y += 1) {
            for (let x = 0; x < imgData.width; x += 1) {
                const cData = data[idx] || null
                if(cData && cData[0] >= this.targetColor) {
                    res.push([
                        x,
                        y,
                        //parseColor([cData[0], cData[1], cData[2]]),
                    ])
                }
                // if(cData[0] != 0) {
                //     console.log( x, y, cData)
                // }
                idx ++
            }
        }
        return res
    }
}