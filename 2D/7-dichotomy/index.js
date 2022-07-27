const df = 500
const scale = 1
let zoff = 0.01

function getNoiseByPoint(p){
    const {x, y}=p
    const value = (1+noise.simplex3(x / df, y / df, zoff)) * 1.1 * 128;
    return rotateVector(x * scale, y * scale, value / ( PI * 2))
}
class Grid {
    constructor() {
        this.x = Xmid
        this.y = Ymid
        this.size = 20
        this.pointMap = new Map()
    }
    generate() {
        //return log(getNoiseByPoint({x:30, y:50}))
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
            p.next = getNext(p, angle)//nonext?{a:null, b:null}:
            
            if(p.y>=0 && p.x>=0 && p.y<Ymax && p.x<Xmax) {
                this.pointMap.set(n, p)
                let ns = getNoiseByPoint(p.next.a) 
                genNext(p.next.a, angle+ns.angle*0.5)
                ns = getNoiseByPoint(p.next.b) 
                genNext(p.next.b, angle+ns.angle*0.5)
                ns = getNoiseByPoint(p.next.c) 
                genNext(p.next.c, angle+ns.angle*0.5)
            } 
        }
        genNext({x:this.x, y:this.y}, 90)

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
    
    const animate = async () => {
        clear()
        grid.generate()
        grid.draw()


        
    
    
        await pauseHalt()
        await sleep(.1)
        zoff+=5
        requestAnimationFrame(animate)
    }
    animate()
}



ctx.background('#111')
main()
