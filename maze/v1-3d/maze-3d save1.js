const 
rows =  30,
cols = 30,
height = 2,
useSquares = true;

const 
rawWidth = ceil(cnv.clientWidth/rows),
rawHeight = ceil(cnv.clientHeight/cols);

const tileSize = rawWidth/2


ctx.lineWidth = 1
ctx.background('#fff')

const SPEED_X = 1.5
const SPEED_Y = 1
const SPEED_Z = 1
let timeDelta = 38

class Point3d {
    constructor(x, y, z) { 
        this.x = x; this.y = y; this.z = z; 
    }
}

class GridBlock {
    constructor(x, y, z) {
        this.x = x*tileSize
        this.y = y*tileSize
        this.z = z*tileSize*2

        this.projx = x
        this.projy = y


        this.vertices = [
            new Point3d(this.x - tileSize, this.y - tileSize, this.z - tileSize),
            new Point3d(this.x + tileSize, this.y - tileSize, this.z - tileSize),
            new Point3d(this.x + tileSize, this.y + tileSize, this.z - tileSize),
            new Point3d(this.x - tileSize, this.y + tileSize, this.z - tileSize),
            new Point3d(this.x - tileSize, this.y - tileSize, this.z + tileSize),
            new Point3d(this.x + tileSize, this.y - tileSize, this.z + tileSize),
            new Point3d(this.x + tileSize, this.y + tileSize, this.z + tileSize),
            new Point3d(this.x - tileSize, this.y + tileSize, this.z + tileSize)
        ];
        this.edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // back face
            [4, 5], [5, 6], [6, 7], [7, 4], // front face
            [0, 4], [1, 5], [2, 6], [3, 7] // connecting sides
        ];
    }
    project() {
        // rotate the cube along the z axis
        let angle = timeDelta * 0.001 * SPEED_Z * PI2;
        // for (let v of this.vertices) {
        //     v.x = v.x * Math.cos(angle) - v.y * Math.sin(angle)
        //     v.y = v.x * Math.sin(angle) + v.y * Math.cos(angle)
        // }

        // rotate the cube along the x axis
        angle = timeDelta * 0.001 * SPEED_X * PI2;
        for (let v of this.vertices) {
            v.y = v.y * Math.cos(angle) - v.z * Math.sin(angle)
            v.z = v.y * Math.sin(angle) + v.z * Math.cos(angle)
        }

        // rotate the cube along the y axis
        angle = timeDelta * 0.001 * SPEED_Y * PI2;
        for (let v of this.vertices) {
            v.x = v.z * Math.sin(angle) + v.x * Math.cos(angle)
            v.z = v.z * Math.cos(angle) - v.x * Math.sin(angle)
        }
    }
    show(cl) {
        ctx.save()
        ctx.translate(this.x, this.y)
        // ctx.fillStyle = 'red'
        // ctx.fillText(str(this.x)+';'+str(this.y), this.x, this.y)
        ctx.strokeStyle = cl
        for (let edge of this.edges) {
            ctx.beginPath();
            ctx.moveTo(this.vertices[edge[0]].x, this.vertices[edge[0]].y);
            ctx.lineTo(this.vertices[edge[1]].x, this.vertices[edge[1]].y);
            ctx.stroke();
        }
        ctx.translate(-this.x, -this.y)
        ctx.restore()
    }
}

class Grid {
    constructor() {
        this.grid = []
    }
    generate() {
        this.grid = []
        for(let z = 0; z<height; z++) {
            const layer = []
            for(let y = 0; y<cols; y++) {
                const row = []
                for(let x = 0; x<rows; x++) {
                    row.push(new GridBlock(x, y, z))
                }
                layer.push(row)
            }
            this.grid.push(layer)
        }
    }
    show() {
        for(let z = 0; z<height; z++) {
            let cl = z%2==0 ? 'red' : 'blue'
            for(let y = 0; y<cols; y++) {
                for(let x = 0; x<rows; x++) {
                    const c = this.grid[z][y][x]
                    c.project()
                    c.show(cl)
                    // ctx.fillStyle = 'blue'
                    // ctx.fillText(round(c.x)+';'+round(c.y), c.x, c.y)
                }
            }
        }
    }
}


const grid = new Grid()
async function animate() {
    clear()
    grid.generate()
    grid.show()
    await sleep()
    await pauseHalt()
    timeDelta++
    //requestAnimationFrame(animate)
}

animate()

// const a = new GridBlock(200, 200, 1)
// const b = new GridBlock(400, 200, 1)
// a.project()
// a.show()
// b.project()
// b.show()
