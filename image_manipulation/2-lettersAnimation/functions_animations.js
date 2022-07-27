class WordAnime {
    constructor() {
        this.fontSize = 20
        this.input = ""
        this.letterData = []
        this.accuracy = 1
    }


    writeText(letters = "") {
        ctx.font = this.fontSize  + "rem sheepsans";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        this.input = letters

        clear()
        ctx.fillStyle = "green"
        ctx.fillText(this.input, Xmid, Ymid);
    }

    getPixel(x, y, size = 1) {
        console.log(ctx.getImageData(x, y, 1, 1).data)
        ctx.fillStyle = "red"
        ctx.fillRect(x -size / 2, y -size / 2, size + 2, size + 2)
        return
    }

    async getPixels({borderFiltered = true, showArea = false} = {}) {
        const res = []
        let size = this.fontSize * 7
        let xSize = size * +(this.input.length || 1) * 0.6
        const posX = Xmid - xSize
        const posY = Ymid - size

        const imgData = ctx.getImageData(posX, posY, xSize * 2, size * 2);
        const data = arrayChuck([...imgData.data], 4)


        if (showArea) {
            ctx.rect(posX - 2, posY - 2, xSize * 2 + 4, size * 2 + 4)
            ctx.stroke()
        }

        let idx = 0
        for (let y = 0; y < imgData.height; ++y) {
            for (let x = 0; x < imgData.width; ++x) {
                if(data[idx]) {
                    res.push({
                        x: posX + x,
                        y: posY + y,
                        cl: parseColor([data[idx][0], data[idx][1], data[idx][2]]),
                        border: data[idx][3] > 0 && data[idx][3] < 255 ? true : false
                    })
                }
                idx ++
                await pauseHalt()
            }
        }
        
        const cleaned = res.filter((i, idx) => {
            if((borderFiltered && i.border) && (idx % this.accuracy == 0 )&& (i.cl !== "#000000" && i.cl !== "#ffffff")) {
                return i
            }
        })

        this.letterData = cleaned
        return cleaned
    }

    setPixels(data = this.letterData) {
        ctx.beginPath();

        data.forEach((i) => {
            ctx.fillStyle = i.cl
            ctx.fillRect(i.x , i.y - 200, 1, 1)
        })
        ctx.stroke();
    }



    addlight(x, y, size = 150) {
        const grd = ctx.createRadialGradient(x, y, 10, x, y, 150);
        grd.addColorStop(0, "white");
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 600, 400);
      }

}