//document.getElementById("start").parentElement.remove()

const tileWidth = 60,
tileHeight = 30;

let spX = 0,
spY = 0;


const material = {
    grass: hsl(120, 50, 50, 1, true),
    earth: hsl(40, 50, 40, 1, true),
    water: hsl(195, 30, 60, 0.8, true),
    sand: hsl(40, 40, 60, 1, true),
    rock: hsl(60, 20, 20, 1, true),
    white: hsl(0, 0, 100, 1, true)
}




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
    const {grass:g, earth:e, water:w, sand:s, rock:r} = material

    // grid [0: height, 1: type]
    const grid =  [
        [[g, 0],[g, 0],[g, 0],[g, 0],[g, 1],[g, 2],[g, 1],[g, 0],[g, 0],[g, 0]],
        [[g, 0],[e, 1],[g, 0],[g, 1],[e, 2],[r, 4],[e, 2],[g, 0],[s, 0],[w, 0]],
        [[g, 0],[e, 2],[e, 1],[e, 2],[e, 3],[r, 3],[g, 1],[s, 0],[w, 0],[w, 0]],
        [[g, 0],[g, 1],[g, 0],[g, 1],[e, 2],[r, 5],[g, 0],[w, 0],[w, 0],[w, 0]],
        [[g, 1],[g, 2],[w, 0],[w, 0],[g, 0],[r, 2],[g, 1],[w, 0],[w, 0],[w, 0]],
        [[w, 0],[r, 3],[w, 0],[w, 0],[w, 0],[w, 0],[w, 0],[w, 0],[w, 0],[w, 0]],
        [[w, 0],[w, 0],[w, 0],[w, 0],[w, 0],[w, 0],[w, 0],[w, 0],[w, 0],[w, 0]],
    ]
    return grid
}


const animate = async() => {
    clear()

    ctx.translate(Xmax/2 + spX, 250 + spY)
    const grid = generateGrid()

    for(let x of range(grid.length)) {
        for(let y of range(grid[0].length)) {
            const c = grid[x][y]
            drawBLock(x, y, c[0]===material.water ? -0.1 : c[1] , c[0])
        }
    }
    ctx.translate(-(Xmax/2 + spX), -(250 + spY))
    await pauseHalt()
    await sleep(.1)
    requestAnimationFrame(animate)
}




const inc = 10
window.onkeydown = (e)=> {
    if(pause) return
    const ev = e.key
    if(ev === 'ArrowUp') {
      spY -= inc
    } else if(ev === 'ArrowDown') {
      spY += inc
    } else if(ev === 'ArrowLeft') {
      spX -= inc
    } else if(ev === 'ArrowRight') {
      spX += inc
    }
  }



animate()