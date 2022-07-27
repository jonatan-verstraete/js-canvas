class Sphere {
    constructor(args={}) {
        const setup = Object({
            color: false,
            depth: 900,
            minDepth: 0,
            center: { x: Xmid, y: Ymid },
            rotHorizontal: 1,
            radius: 300,
            maxSize: 15,
            minSize: 3,
            amount: 2201,
            noiseScale: 1.5,
            df: 1500,
            preferdShape:["default", "triangle", "circle"][0],
        })
        const setupOriginal = Object.copy(setup)


        ctx.invert()
        let zoffAmount = 0.002
        let zoff = 0

        // point class
        class Point {
            constructor(id) {
                this.id = id
                this.alpha = 1
                this.theta = randfloat(0, PI2, 5)
                this.phi = randfloat(0, PI, 5)
                this.projScale = 0
                this.projX = 0
                this.projY = 0
                this.x = 0
                this.y = 0
                this.z = 0
                this.size = 1
            }

            project() {
                this.x = setup.radius * sin(this.phi) * cos(this.theta)// * tanh(this.y)
                this.y = setup.radius * cos(this.phi)
                this.z = setup.radius * sin(this.phi) * sin(this.theta) + setup.radius

                this.projScale = setup.depth / (setup.depth + this.z)
                this.projX = (this.x * this.projScale) + setup.center.x
                this.projY = (this.y * this.projScale) + setup.center.y

                this.size = mapNums(this.z, 0, setup.depth, setup.maxSize, setup.minSize)
                this.alpha = mapNums(this.z, 0, setup.depth, 1, 0)
            }

            move() {
                this.theta += 0.01 * setup.rotHorizontal
                this.project()
            }
        }


        // points class
        class Points {
            constructor(count) {
                this.points = [...new Array(count)].map((i, idx) => new Point(idx))
                this.colorScale = 360
            }
            showMovement(frequencyData) {
                this.points = this.points.sortAc('projScale')

                this.points.forEach((i, idx, arr) => {
                    i.move()
                    const thisColor = i.alpha > 0 ? hsl(0, 0, 100 - 100 * posInt(i.alpha), 0.8) : "#11111100"


                    let value = noise.simplex3(i.x /  setup.df, i.y /  setup.df, zoff)
                    value = (1 + value) * 1.1 * 128
                    const angle = value / (PI * 2)

                    //const vx = (i.projX-(setup.center.x+setup.radius))/1
                    const v = rotateVector(i.projX * setup.noiseScale * frequencyData/100, i.projY, angle)


                    ctx.lineWidth = i.size / 10

                    switch(setup.preferdShape) {
                        case "triangle":
                            triangle(i.projX, i.projY, (v.x-v.y) / 4,{rotate:360-(angle*(360/50)), filled:true, sharpness:2})
                            break;
                        case "circle":
                           circle(i.projX, i.projY, (v.x - v.y)*0.3)//, "white"
                           break;
                        default:
                            line(i.projX, i.projY, i.projX + v.x, i.projY + v.y, thisColor)
                            return
                     }
                    //line(i.projX, i.projY, i.projX + v.x, i.projY + v.y, thisColor)
                    //line(i.projX, i.projY-3,i.projX+v.x,  i.projY+v.y-3, "#33333333")
                    //point(i.projX, i.projY, i.size, thisColor) 
                })
            }
        }
        function ControlRotating() {
            window.addEventListener('keydown', (e) => {
                const k = e.key
                if (k === "r") {
                    log(setup, setupOriginal)
                    pause.toggle()
                    setup.inherit(setupOriginal)
                    exitting()
                } else if (k === "ArrowLeft") {
                    setup.rotHorizontal -= 0.2
                } else if (k === "ArrowRight") {
                    setup.rotHorizontal += 0.2
                } else if (k === "ArrowUp") {
                    setup.radius += 5
                } else if (k === "ArrowDown") {
                    setup.radius -= 5
                }else if (k === "+") {
                    zoffAmount = -0.005
                } else if (k === "-") {
                    zoffAmount = 0.005
                }
            })
        }
        for (let key in args) {
            if(key != this.inherit.name) setup[key] = args[key]
        }
         
        ControlRotating()
        const Pointz = new Points(setup.amount)
        
        this.animate = (data) => {
            const dLength = data.length / 6
            const f20   = round(data.slice(0, 1).reduce((t, i)=>t+=i))
            const f80   = round(data.slice(0, 3).reduce((t, i)=>t+=i)/3)
            const f2000 = round(data.slice(45, 50).reduce((t, i)=>t+=i)/5)
            const f8000 = round(data.slice(dLength*2, data.length).reduce((t, i)=>t+=i)/dLength)
    
            setup.radius = setupOriginal.radius + f80/2
                
            Pointz.showMovement(f2000)
            zoff += zoffAmount
        }
    }
}






 
async function main() {
    // textCenter("press arrows")
    // await sleep(1)
    const spheres = [
        new Sphere(),
        // new Sphere({
        //     center: {
        //         x: Xmid, 
        //         y:100
        //     },
        //     amount: 600,
        //     radius: 100,
        // })
    ]



    function animation(audioData) {
        clear()
        spheres.forEach(n=>n.animate(audioData))
    }

    // yields/provides audio data to animation()
    GatherAudio((d)=>animation(d))
}

//defaultEvents = false
main()