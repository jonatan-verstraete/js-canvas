let fov = 112,         /// Field of view kind of the lense, smaller values = spheric
viewDist = 22,     /// view distance, higher values = further away
w = cnv.width / 2,  /// center of screen
h = cnv.height / 2,
angle = -8,       /// grid angle
i, p1, p2,         /// counter and two points (corners)
grid = 15;         /// grid size in Cartesian

let px = py = 0;
let speed = 0.2


function rotateX(x, y) {
    var rd, ca, sa, ry, rz, f;




    rd = angle * Math.PI / 180; /// convert angle into radians
    ca = Math.cos(rd);
    sa = Math.sin(rd);

    ry = y * ca;   /// convert y value as we are rotating
    rz = y * sa;   /// only around x. Z will also change

    /// Project the new coords into screen coords
    f = fov / (viewDist + rz);
    x = x * f + w;
    y = ry * f + h;
    return [x, y];
}


function lazarus() {

}

class Grid {
    constructor(x=0, y =0, ) {
        y -= 50
        this.x = x
        this.y = y
        this.ix = x
        this.iy = y
        this.speedX = randint(1) ? speed : -speed
        this.speedY = randint(1) ? speed : -speed

    }
    show() {
        // this.x = overcount(this.ix+px, 120, -100, false)
        // this.y = overcount(this.iy+py, 120, -100, false)
        this.x += this.speedX
        this.y += this.speedY
        if(this.y > 320 || this.y < -320 || this.x < -320 || this.x > 320) this.lazarus()
        if(this.y < -120) return
        point(this.x, this.y, 20)


        const { x, y } = this
        ctx.strokeStyle = hsl(0, 0, 50, 200/posInt(this.y))

        /// create vertical lines
        for(i = -grid; i <= grid; i++) {
            p1 = rotateX(i+x, -grid+y);
            p2 = rotateX(i+x, grid+y);
            line(p1[0], p1[1], p2[0], p2[1]); //from easyCanvasJS, see demo
        }

        /// create horizontal lines
        for(i = -grid; i <= grid; i++) {
            p1 = rotateX(-grid+x, i+y);
            p2 = rotateX(grid+x, i+y);
            line(p1[0], p1[1], p2[0], p2[1]); //from easyCanvasJS, see demo
        }
    }
    lazarus() {
        grids.splice(grids.indexOf(this), 1, new Grid(this.ix, this.iy))
        log(1)
    }
}


const grids = range(10).map(i=>new Grid((i+0.1)*10, (i+0.1)*-20))


async function showGrid() {
    clear()
    grids.forEach(i=>i.show())
    await pauseHalt()
    requestAnimationFrame(showGrid)
    py+=0.1
}

// window.onkeydown = (ev)=> {
//     if(ev.key == 'ArrowDown') {
//         viewDist++
//     } else  if(ev.key == 'ArrowUp') {
//         viewDist--
//     }
// }

window.onkeydown = (ev)=> {
    if(ev.key == 'ArrowDown') {
        py++
    } else  if(ev.key == 'ArrowUp') {
        py--
    }
}

showGrid()