class Grid {
    constructor() {
        this.x = Xmid
        this.y = Ymid
        this.size = 20
        this.pointMap = new Map()
    }
    generate() {
        let depth = 0
        const getNext =(n, ang)=> {
            const {x:xa, y:ya} = posByAngle(floor(n.x), floor(n.y), degRad(135+ang), this.size)
            const {x:xb, y:yb} = posByAngle(floor(n.x), floor(n.y), degRad(40+ang), this.size)
            const {x:xc, y:yc} = posByAngle(floor(n.x), floor(n.y), degRad(200+ang), this.size)

            return {a: {x:floor(xa), y:floor(ya)}, b: {x:floor(xb), y:floor(yb)}, c:{x:floor(xc), y:floor(yc)}}
        }

         const genNext= (p, angle)=> {
            const n = sCoord(p.x, p.y)
            depth++
            if(depth > 10 * this.size ) return
            if(this.pointMap.has(n)) return
            if(angle>360||angle<0)angle=0
            p.next = getNext(p, angle)
            
            if(p.y>=0 && p.x>=0 && p.y<Ymax && p.x<Xmax) {
                this.pointMap.set(n, p)
                genNext(p.next.a, angle+randint(-50,50))
                genNext(p.next.b, angle+randint(-50,50))
                genNext(p.next.c, angle+randint(-50,50))

            } //else log("out")
        }
        genNext({x:this.x, y:this.y}, 0)

    }
    draw() {

        for(let i of this.pointMap.values() )  {
            line(i.x, i.y, i.next.a.x, i.next.a.y, "#f00f")
            line(i.x, i.y, i.next.b.x, i.next.b.y, "#f00f")
            line(i.x, i.y, i.next.c.x, i.next.c.y, "#f00f")

        }
    }
}






const grid = new Grid()


function main() {
    grid.generate()
    grid.draw()
    
    const animate = async () => {
        clear()


        
    
    
        await pauseHalt()
        await sleep(.1)
        requestAnimationFrame(animate)
    }
    animate
}



ctx.background('#111')
main()
