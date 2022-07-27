class Grid {
    constructor() {
        this.x = Xmid
        this.y = 0
        this.size = 20
        this.pointMap = new Map()
    }
    generate() {
        let depth = 0
        const getNext =(n)=> {
            const {x:xa, y:ya} = posByAngle(floor(n.x), floor(n.y), degRad(135), this.size)
            const {x:xb, y:yb} = posByAngle(floor(n.x), floor(n.y), degRad(40), this.size)
            return {a: {x:floor(xa), y:floor(ya)}, b: {x:floor(xb), y:floor(yb)}}
        }

         const genNext= (p)=> {
            const n = sCoord(p.x, p.y)
            depth++
            if(depth > 10 * size ) return
            if(this.pointMap.has(n)) return
            p.next = getNext(p)
            
            if(p.y>=0 && p.x>=0 && p.y<Ymax && p.x<Xmax) {
                this.pointMap.set(n, p)
                genNext(p.next.a)
                genNext(p.next.b)

            } else log("out")
        }
        genNext({x:this.x, y:this.y})

    }
    draw() {

        for(let i of this.pointMap.values() )  {
            line(i.x, i.y, i.next.a.x, i.next.a.y, "#f003")
            line(i.x, i.y, i.next.b.x, i.next.b.y, "#f003")
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
