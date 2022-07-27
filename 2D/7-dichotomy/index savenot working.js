function outBounds(p) {
    if(p.y<0  || p.x<0 || p.y>Ymax||  p.x>Xmax) true
}
class Grid {
    constructor() {
        this.x = Xmid
        this.y = 0
        this.size = 50
        this.points = []
        this.pointMap = new Map()
    }
    generate() {
        let depth = 0
        const getNext =(n)=> {
            const {x:xa, y:ya} = posByAngle(floor(n.x), floor(n.y), degRad(135), this.size)
            const {x:xb, y:yb} = posByAngle(floor(n.x), floor(n.y), degRad(45), this.size)
            return {a: {x:floor(xa), y:floor(ya)}, b: {x:floor(xb), y:floor(yb)}}
        }

         const genNext= (p)=> {
            const n = sCoord(p.x, p.y)
            depth++
            if(depth > 500) return
            if(this.pointMap.has(n)) return
            if(outBounds(p)) return

            const next = getNext(p)
            if(outBounds(next.a)) return
            if(outBounds(next.b)) return

            p.next = {a: sCoord(next.a.x, next.a.y), b: sCoord(next.b.x, next.b.y)}
            p.noise = 0
            this.pointMap.set(n, p)

            genNext(next.a)
            genNext(next.b)
            
        }
        genNext({x:this.x, y:this.y})
    }
    draw() {
        for(let i of this.pointMap.values() )  {
            const value = noise.perlin3(  i.x/2000 ,  i.y/2000,  zoff)
            const angle = ((1 + value) * 1.1 * 128) / PI2
            const v = rotateVector(i.x * 500, i.y, angle)
            i.noise = v
        }

        for(let i of this.pointMap.values() )  {
            const {noise:n, next} = i
            const a = this.pointMap.get(next.a)
            const b = this.pointMap.get(next.b)
            log(a, b, next)

            line(i.x+n.x, i.y+n.y, a.x+a.noise.x, a.y+a.noise.y, "#f003")
            line(i.x+n.x, i.y+n.Y, b.x+b.noise.X, b.y+b.noise.y, "#f003")
        }
    }
}





let zoff = 0
const grid = new Grid()


function main() {
    grid.generate()
    grid.draw()
    
    const animate = async () => {
        clear()


        
    
    
        await pauseHalt()
        await sleep(.1)
        requestAnimationFrame(animate)
        zoff +=0.05
    }
    animate
}



ctx.background('#111')
main()
