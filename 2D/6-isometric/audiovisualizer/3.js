
class Grid {
  constructor() {
    this.gris = []
    this.gridSize = 13
    this.tileSize = 50
    this.rarety = 4
  }
  setup() {
    this.grid = []
    for(let x = 0; x< this.gridSize; x++)  {
      const row = []
      for(let y = 0; y< this.gridSize; y++) {
        // is a diamond point
        if(y%this.rarety ===0 && x%this.rarety ===0) row.push({x:x*this.tileSize, y:y*this.tileSize, v: randint(360), c:false})
        // is a normal field point
        else row.push({x:x*this.tileSize, y:y*this.tileSize, v: 0, c:true})
      }
      this.grid.push(row)
    }
  }
  /** getst he average vale of all serrounding fields (at a certain distance)*/
  calcualteNeighbours(x, y, r=1) {
    let dir = [[x-r,y-r], [x, y-r], [x+r, y-r],
              [x-r, y  ],           [x+r, y  ],
              [x-r, y+r], [x, y+r], [x+r, y+r]];
    let sum = 0
    let count = 0
    for(let i of dir) {
      if(i[0]>=0 && i[1]>=0 && i[0]<=this.grid[0].length-1 && i[1]<=this.grid.length-1) {
        const c = this.grid[i[1]][i[0]]
        sum += c.v
        count+= c.v===0 ? 0.01 : 1
      }
    }
    return round(sum/count)
  }
  /** dispalyes grid with values and colors */
  show() {
    for(let px of this.grid) {
      for(let py of px) {
        const {x, y, v} = py

        if(this.grid.indexOf(px)%this.rarety ===0 && px.indexOf(py)%this.rarety ===0) square(x, y, this.tileSize, "blue", "blue")
        else square(x, y, this.tileSize, "blue", "red")

        ctx.fillStyle = "white"
        ctx.fillText(str(v), x+this.tileSize/2, y+this.tileSize/2)
      }
    }
  }
  /** main diamond function (own version) */
  diamond(iterations = 1, dis= 1) {
    for(let i = 0; i< iterations; i++) {
      const iterGrid = [...this.grid]
      for(let px = 0; px < this.grid.length; px++) {
        for(let py =0; py < this.grid[0].length; py++) {
          if(this.grid[px][py].c || true) iterGrid[px][py].v = this.calcualteNeighbours(px, py, dis)
        }
      }
      this.grid = iterGrid
    }
  }

  final() {
    for(let px of this.grid) {
      for(let py of px) {
        const {x, y, v} = py

        square(x, y, this.tileSize, "blue", hsl(v))

        ctx.fillStyle = "white"
        ctx.fillText(str(v), x+this.tileSize/2, y+this.tileSize/2)
      }
    }
  }
}

const main =async ()=> {
  ctx.translate(500, 200)
  const grid = new Grid()
  grid.setup()
  grid.diamond(3)
  grid.show()
  grid.final()
}

main()