const tileWidth = 60,
tileHeight = 30;

function drawBLock(x, y, z=1, cl={}) {
    const top = hsl(cl.v, cl.s, cl.l+10, cl.a),
    bottom = hsl(cl.v, cl.s, 10, cl.a)
    left = hsl(cl.v, cl.s, posInt(cl.l-20), cl.a),
    right = hsl(cl.v, cl.s, posInt(cl.l-10), cl.a);

    z += 1
    ctx.save()
    ctx.translate((x-y) * tileWidth/2, (x+y) * tileHeight/2)

    // bottom
    ctx.fillStyle = bottom
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(tileWidth/2, tileHeight/2)
    ctx.lineTo(0, tileHeight)
    ctx.lineTo(-tileWidth/2, tileHeight/2)
    ctx.closePath()
    ctx.fill()
    // top
    ctx.fillStyle = top
    ctx.beginPath()
    ctx.moveTo(0, -z*tileHeight)
    ctx.lineTo(tileWidth/2, tileHeight/2-z*tileHeight)
    ctx.lineTo(0, tileHeight-z*tileHeight)
    ctx.lineTo(-tileWidth/2, tileHeight/2-z*tileHeight)
    ctx.closePath()
    ctx.fill()
    // left
    ctx.fillStyle = left
    ctx.beginPath()
    ctx.moveTo(-tileWidth/2, tileHeight/2-z*tileHeight)
    ctx.lineTo(0, tileHeight-z*tileHeight)
    ctx.lineTo(0, tileHeight)
    ctx.lineTo(-tileWidth/2, tileHeight/2)
    ctx.closePath()
    ctx.fill()
    // left
    ctx.fillStyle = right
    ctx.beginPath()
    ctx.moveTo(tileWidth/2, tileHeight/2-z*tileHeight)
    ctx.lineTo(0, tileHeight-z*tileHeight)
    ctx.lineTo(0, tileHeight)
    ctx.lineTo(tileWidth/2, tileHeight/2)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
}



function generateGrid() {
    return range(10).map((i)=> {
        return range(10).map((j)=> [ randfloat(5), hsl(0, 0, randint(100), 1, true)] )
    })
}

const audioScale = 8

ctx.translate(Xmax /2, 450)

let skipinterval = 0
const animate = (rawData) => {
    if(skipinterval < 3) {
        skipinterval++
        return 
    }
    skipinterval = 0
    ctx.translate(-Xmax /2, -450)
    clear()
    ctx.translate(Xmax /2, 450)
    const data = [...rawData].scaleBetween(0, audioScale).map((i)=>toFixed(i, 2))

    for(let x of range(audioScale)) {
        for(let y of range(audioScale)) {            
            drawBLock(x, y, data[x+y], hsl((360/audioScale) * (x+y), 50, 50, 1, true))
        }
    }
    // for(let x of range(10)) {
    //     for(let y of range(10)) {            
    //         drawBLock(x, y, data[x+y], hsl(0, 50, 50, 1, true))
    //     }
    // }
}

GatherAudio((e)=>animate(e))




