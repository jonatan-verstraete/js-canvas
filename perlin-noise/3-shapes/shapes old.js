const   preferdShape = ["lines", "triangle", "circle", "dots"],
        colorMode = [null, "byId", "byDepth"],
        shapeStyle = ["sphere", "amorf"];


/** Shape class
 * each initialisation has complete unique events which react in a unique way
 */
class Sphere {
    constructor(args={}) {
        this.id = getUniqueId()
        this.zIndex = window.uniqueIds
        this.otherShapes = []

        const setup = Object({
            depth: 900,
            minDepth: 0,
            center: { x: Xmid, y: Ymid },
            rotHorizontal: 0.5,
            rotHVertical: 1,
            radius: 300,
            maxSize: 15,
            minSize: 3,
            amount: 4220,
            noiseScale: 0.9,
            df: 2500,
            zoff: 100,
            zoffAmount: 0.003,
            events: {
                global: 1,
                zoffAmount: 0.001,
                rotHorizontal:0.2,
                depth:10,
                radius:10, 
            },
            preferdShape: preferdShape[1],
            colorMode: colorMode[1],
            shapeStyle: shapeStyle[1],
            hueRotation: 0,
            hueScale: 360,
        })



        for (let [key, val] of Object.entries(args)) {
            if(setup[key] != undefined) {
                if(Object.is(val)) {
                    for (let [k, v] of Object.entries(val)) {
                        setup[key][k] = v
                    }
                }
                else setup[key] = args[key]
            }
        }

        this.setupOriginal = Object.copy(setup)


        ctx.invert()


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
                this.color = 1
            }

            project() {
                const { radius:rad, depth, maxSize, minSize, center} = setup
                this.x = rad * sin(this.phi) * cos(this.theta) 
                this.y = rad * cos(this.phi)  * cos(this.theta)
                this.z = rad * sin(this.phi) * sin(this.theta) + rad

                this.projScale = depth / (depth + this.z)
                this.projX = (this.x * this.projScale) + center.x
                this.projY = (this.y * this.projScale) + center.y

                this.size = mapNums(this.z, 0, depth, maxSize, minSize)
                this.alpha = mapNums(this.z, 0, depth, 1, 0)
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
            }
            assignColors() {
                this.points.forEach(i=>i.move())
                this.points.forEach((i, id) => {
                    i.color = setup.hueScale*i.alpha
                })
            }
            showMovement() {
                this.points = this.points.sortAc('projScale')

                this.points.forEach((i, idx, arr) => {
                    i.move()
                    if(i.alpha < -0.9) return
                    if(this.otherShapes) for(let n of range(this.otherShapes.length)) {
                        const cs = this.otherShapes[n]
                        const dis = closeTo(i, cs.c)
                        log(dis, cs)
                        exitting()
                        if(dis) return exitting("close to")
                    } 

                    // exitting()
                    if(i.projX > Xmax || i.projY > Ymax || i.projX < Xmin || i.projY < Ymin ) return
                    const c = setup.colorMode=="byDepth" ? setup.hueScale * i.alpha :  i.color
                    const thisColor = setup.colorMode ? hsl(overcount(c+setup.hueRotation, setup.hueScale), (setup.colorMode ?50:0), 100 - 80 * posInt(i.alpha), 0.6) : "#1111119f"

                    let value = noise.simplex3(i.x/setup.df * (setup.shapeStyle=="amorf" ?tanh(i.projX) : 1), i.y/setup.df * (setup.shapeStyle=="amorf" ?tanh(i.projY) : 1), setup.zoff)
                    const angle = ((1 + value) * 1.1 * 128) / (PI * 2)
                    const v = rotateVector(i.projX * setup.noiseScale, i.projY, angle)
                    

                    switch(setup.preferdShape) {
                        case "triangle":
                            ctx.fillStyle = thisColor
                            triangle(i.projX+v.x, i.projY+v.y, (v.x-v.y) / 4,{rotate:(angle*(setup.hueScale)), filled:true, sharpness:2})
                            break;
                        case "circle":
                           circle(i.projX+v.x, i.projY+v.y, (v.x - v.y)*0.2, thisColor)//, "white"
                           break;
                        case "lines":
                            ctx.lineWidth = i.size / 10
                            line(i.projX, i.projY, i.projX + v.x, i.projY + v.y, thisColor)
                            break;
                        case "dots":
                            point(i.projX+v.x, i.projY+v.y, i.size, thisColor)
                            break;
                        default:
                            textCenter('shape not found')
                            exitting()
                            return
                     }
                    //shade("#aaaaaa9f")
                })
            }
        }

        if(setup.events) Events.setKeys([
            ["r", ()=>{
                setup.inherit(this.setupOriginal)
                setup.zoffAmount = 0.003
            }],
            ["ArrowLeft", ()=>{
                setup.rotHorizontal -= setup.events.rotHorizontal*setup.events.global}],
            ["ArrowRight", ()=>{
                setup.rotHorizontal += setup.events.rotHorizontal*setup.events.global}],
            ["ArrowUp", ()=>{
                setup.zoffAmount -= setup.events.zoffAmount*setup.events.global}],
            ["ArrowDown", ()=>{
                setup.zoffAmount += setup.events.zoffAmount*setup.events.global}],
            ["z", ()=>{
                setup.depth += setup.events.depth*setup.events.global}],
            ["s", ()=>{
                setup.depth -= setup.events.depth*setup.events.global}],
            ["+", ()=>{
                setup.radius += setup.events.radius*setup.events.global}],
            ["-", ()=>{
                setup.radius -= setup.events.radius*setup.events.global}],             
        ], this.id)


        const Pointz = new Points(setup.amount)
        Pointz.assignColors()
        this.animate = (info={}) => {
            if(!this.info) this.info= info
            Pointz.showMovement()
            setup.zoff += setup.zoffAmount
        }
    }
}



 
async function main() {
    const spheres = [
        new Sphere({
            radius: 1600,
            hueRotation: 200,
            amount: 10000
        }),
        // new Sphere({
        //     color: true,
        //     radius: 900,
        //     amount: 10000,
        //     depth: 1400,
        //     noiseScale: 2,
        //     center: {
        //         x: 300,
        //         y: 300
        //     },
        //     preferdShape: "dots",
        //     zoffAmount: -0.003,
        // })
    ]

    const info = spheres.map(i=>({r:i.setupOriginal.radius, c:i.setupOriginal.center, id:i.id}))
    spheres.forEach(s=> {
        s.otherShapes = info.filter(i=> {
            if(i.id != s.id) return i
        })
    })

    async function animation() {
        clear()
        spheres.forEach(n=>n.animate(info))
        await pauseHalt()
        if(!exit || pause) requestAnimationFrame(animation)
    }
    animation()
}


main()