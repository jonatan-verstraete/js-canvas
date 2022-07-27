const 
rows =  30,
cols = 30,
height = 10,
useSquares = true;

const 
rawWidth = ceil(cnv.clientWidth/rows),
rawHeight = ceil(cnv.clientHeight/cols);

const tileSize = rawWidth


ctx.lineWidth = 2
ctx.background('#fff')

const SPEED_X = 1.5
const SPEED_Y = 1
const SPEED_Z = 1
let timeDelta = 0

class Point3d {
    constructor(x, y, z) { 
        this.x = x; this.y = y; this.z = z; 
    }
}

class GridBlock {
    constructor(x, y, z, side=null) {
        this.x = x*tileSize
        this.y = y*tileSize
        this.z = z*tileSize*2

        this.projx = x
        this.projy = y


        this.vertices = [
            new Point3d(this.x - tileSize, this.y - tileSize, this.z - tileSize), // 0 back top left
            new Point3d(this.x + tileSize, this.y - tileSize, this.z - tileSize), // 1 back top right
            new Point3d(this.x + tileSize, this.y + tileSize, this.z - tileSize), // 2 back bottom right
            new Point3d(this.x - tileSize, this.y + tileSize, this.z - tileSize), // 3 back bottom left
            new Point3d(this.x - tileSize, this.y - tileSize, this.z + tileSize), // 4 front top left
            new Point3d(this.x + tileSize, this.y - tileSize, this.z + tileSize), // 5 front top right
            new Point3d(this.x + tileSize, this.y + tileSize, this.z + tileSize), // 6 front bottom right
            new Point3d(this.x - tileSize, this.y + tileSize, this.z + tileSize), // 7 front bottom left
        ];
        // this.vertices = [
        //     new Point3d(this.x - tileSize/2, this.y - tileSize/2, this.z - tileSize/2), // 0 back top left
        //     new Point3d(this.x + tileSize/2, this.y - tileSize/2, this.z - tileSize/2), // 1 back top right
        //     new Point3d(this.x + tileSize/2, this.y + tileSize/2, this.z - tileSize/2), // 2 back bottom right
        //     new Point3d(this.x - tileSize/2, this.y + tileSize/2, this.z - tileSize/2), // 3 back bottom left
        //     new Point3d(this.x - tileSize/2, this.y - tileSize/2, this.z + tileSize/2), // 4 front top left
        //     new Point3d(this.x + tileSize/2, this.y - tileSize/2, this.z + tileSize/2), // 5 front top right
        //     new Point3d(this.x + tileSize/2, this.y + tileSize/2, this.z + tileSize/2), // 6 front bottom right
        //     new Point3d(this.x - tileSize/2, this.y + tileSize/2, this.z + tileSize/2), // 7 front bottom left
        // ];
        this.f = [
            [[0, 3], [3, 7], [7, 4], [4, 0]], // left face
            [[1, 2], [2, 6], [6, 5], [5, 1]], // right face
            [[0, 1],[1, 2], [2, 3], [3, 0]], // back face
            [[4, 5], [5, 6], [6, 7], [7, 4]], // front face
            [[1, 5], [5, 4], [4, 0], [0, 1]], // top face
            [[2, 6], [6, 7], [7, 3], [3, 2]], // bottom

        ]
        // pick a random edge
        this.edges = this.f[side===null?randint(this.f.length-1):side]

    }
    project() {
        // rotate the cube along the x axis
        let angle = timeDelta * 0.001 * SPEED_X * PI2;
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
    show() {
        const tx = this.x + tileSize/2
        const ty = this.y + tileSize/2

        ctx.save()
        ctx.translate(tx, ty)

        ctx.beginPath();

        const edg = [...this.edges]
        const edg1 = edg.pop()

        ctx.moveTo(this.vertices[edg1[0]].x, this.vertices[edg1[0]].y);
        ctx.lineTo(this.vertices[edg1[1]].x, this.vertices[edg1[1]].y);

        for (let edge of edg) {
            ctx.lineTo(this.vertices[edge[0]].x, this.vertices[edge[0]].y);
            ctx.lineTo(this.vertices[edge[1]].x, this.vertices[edge[1]].y);
        }
        ctx.fill()
        ctx.stroke()
        ctx.translate(-tx, -ty)
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
            const b = ((50/height) * z)+20
            for(let y = 0; y<cols; y++) {
                for(let x = 0; x<rows; x++) {
                    const c = this.grid[z][y][x]
                    c.project()
                    ctx.fillStyle = hsl( 0, b, b )
                    c.show()
                }
            }
        }
    }
}


const grid = new Grid()
const main = ()=> {
    grid.generate()

    async function animate() {
        clear()
        grid.show()
        await sleep()
        await pauseHalt()
        timeDelta+=0.01
        requestAnimationFrame(animate)
    }
    animate()
}

function test() {
    timeDelta+=20.01
    ctx.fillStyle = "#9998"
    
    const blocks =  [
        new GridBlock(3, 2, 1, 1),
        new GridBlock(4, 2, 1, 2),
        new GridBlock(5, 2, 1, 0)
    
    ]
    blocks.forEach((b)=> {
        b.project()
        b.show()
    })
    
}


main()
