/** Main */
const preferdShape = ["triangle", "circle", "lines"][2]
const effect = ["none", "cilindershades", "mirror", "water"][0]

class Effects {
    constructor({shapeData = new Map()}={}) {
        this.shapeData = shapeData
        this.zoff = 0
    }
    clean(data) {
        clear()
        this.data = [...data]
    }
    basicBall(data) {
        this.clean(data)
        const rad1 = 50
        const rad2 = -150
        ctx.lineWidth = 7

        this.data.forEach((val, i) => {
            val /= 2
            const sAngle = (360 / data.length) * i
            const p180 = -sAngle * Math.PI / 180
            let x = Xmid + (rad1) * Math.cos(p180);
            let y = Ymid + (rad1) * Math.sin(p180);
            let x2 = Xmid + (rad2 + val) * Math.cos(p180);
            let y2 = Ymid + (rad2 + val) * Math.sin(p180);

            // if (x2 < x || y2 < y) {
            //     x2 = x; y2 = y;
            // }

            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x2, y2)
            ctx.stroke()
        })
    }

    linesDouble(data) {
        this.clean(data)
        const space = cnv.width/data.length +20
        this.data.forEach((val, i) => {
            ctx.beginPath()
            ctx.moveTo(space * i, Ymid + val)
            ctx.lineTo(space * i, Ymid - val)
            ctx.stroke()
            ctx.closePath()
            ctx.fillText(val, space * i,Ymid+val)
            ctx.fillStyle = "white"
            ctx.fillText(i, space * i,Ymid )

        })
    }

    test(data, data2 = []) {
        this.clean(data)
        const rad1 = 50
        const rad2 = -150
        ctx.lineWidth = 7

        this.data.forEach((val, i) => {
            val /= 2
            const sAngle = (360 / data.length) * i
            const p180 = -sAngle * Math.PI / 180
            let x = Xmid + (rad1) * Math.cos(p180);
            let y = Ymid + (rad1) * Math.sin(p180);
            let x2 = Xmid + (rad2 + val) * Math.cos(p180);
            let y2 = Ymid + (rad2 + val) * Math.sin(p180);

            // if (x2 < x || y2 < y) {
            //     x2 = x; y2 = y;
            // }

            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x2, y2)
            ctx.stroke()
        })
    }



    perlin(data) {
        clear()
        this.clean(data)
        const scale = 10
        const df = 190
        const rows = floor(cnv.width / scale)
        const cols = floor(cnv.height / scale)

        const dLength = this.data.length / 6
        const f80   = round(this.data.slice(0, 3).reduce((t, i)=>t+=i)/3)
        const f2000 = round(this.data.slice(dLength, dLength*2).reduce((t, i)=>t+=i)/dLength)
        const f8000 = round(this.data.slice(dLength*2, this.data.length).reduce((t, i)=>t+=i)/dLength)

        const rad = 200 + round(f8000/10)
        const signal1 = {
            x: Xmid,
            y: Ymid
        }
        const velocity = 5
        const accelerationDevide = 50


        function getImpact(x, y) {
            const s = pow((x - signal1.x), 2) + pow((y - signal1.y), 2)
            if (s <= pow(rad, 2)) {
                return {
                    x: x,
                    y: y,
                    s: round(sqrt(pow(rad, 2) - s))
                }
            }
            return null
        }

        for (let x = 0;x < rows; x++) {
            ctx.beginPath();
            for (let y = 0; y < cols; y++) {
                let value = noise.simplex3(x / df, y / df, this.zoff);
                value = (1 + value) * 1.1 * 128;
                const angle = value / ( PI * 2)
                ctx.fillStyle = `hsl(${angle  *(360/50)}, 50%, 50%)`
                ctx.strokeStyle = `hsl(${angle  *(360/50)}, 50%, 50%)`
        
                const v = rotateVector(x * scale, y * scale, angle)

                // switch(effect) {
                //     case "none":             
                //        break;
                //     case "cilindershades":
                //        v.x *= tanh(v.x)
                //        v.y *= sinh(v.y)               
                //        break;
                //     case "mirror":
                //        v.x *= sin(x)
                //        v.y *= cos(y)              
                //        break;
                //     case "water":
                //        v.x = randint(5) + (sin(v.x) - sin(x))*5
                //        v.y = randint(5) + (cos(v.y) - cos(y))*5           
                //        break;
                //     default:
                //        textCenter("EFFECT NOT FOUND",40)
                //        return exitting()
                //  }

                 function getShape(x, y) {
                    switch(preferdShape) {
                        case "triangle":
                           triangle(x, y, (v.x-v.y) / 4,{rotate:360-(angle*(360/50)), filled:true, sharpness:9})
                           break;
                        case "circle":
                           circle(x, y, (v.x - v.y)*0.3)//, "white"
                           break;
                        case "lines":
                            ctx.lineTo(x, y)
                           break;
                        default:
                           textCenter("SHAPE NOT FOUND",40)
                           return exitting()
                     }
                 }

                





                const posx = x * scale + v.x
                const posy = y * scale + v.y


                const impact = getImpact(posx, posy)
                if (!impact) {
                    getShape(posx, posy)
                } else {
                    const speed = ((rad-impact.s*0.9)/accelerationDevide) * f2000/4
                    const im = posTowards({x:posx, y:posy}, signal1, speed)

                    getShape(posx + im.x, posy + im.y)
                }
            }
            ctx.stroke();
        }
        this.zoff += 0.005;
        ctx.fillStyle = "#000"
       //  textCenter("b: "+f80+" m: "+f2000+" h: "+f80)
    }
}

const b123 = async()=> {
    for(let j in range(360)) {
        clear()
        for(let i in range(360)) {
            const r = 300
            const p180 = -i * Math.PI / 180
            const x = Xmid + r * Math.cos(p180);
            const y = Ymid + r * Math.sin(p180);
        
            const o = rotateVector(x, y, i + j)
            line(x, y, Xmid + o.x, Ymid + o.y)
        }
        await sleep()
    }
}
