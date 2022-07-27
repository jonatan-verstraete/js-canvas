
// default values, as to give an overview of what is posible
const   preferdShapes = ["lines", "triangles", "circles", "dots", "matrix"],
        colorModes = [null, "byId", "byDepth"],
        shapeStyles = ["sphere", "amorf"];


const GSM =  {
    new(slotName = getUniqueId(), args={}) {
        this[slotName] = {}
        // deep copys all values so no old memory traces are stored
        this[slotName].inherit(Object.copy(args, true))
        this[slotName].backup = Object.copy(this[slotName], true)
    },
    add(name, key, val) {
        this[name][key]= val
    },
    reset(name){
        this[name].inherit(this[name].backup, true)
    },
    clear(name){
        for (let i in this[name]) {
            delete this[name][i];
        }
    },
    wipe() {
        for (let i in this) {
            if(typeof i !== 'function') {
                delete this[i];
            }
        }
    }
}



/**
 * point class
 */
class Point  {
    constructor(id, memoId) {
        this.pointId = id
        this.memoId = memoId

        this.alpha = 1
        this.theta = randfloat(0, PI2, 5)
        this.phi = randfloat(0, PI, 5)
        this.projScale = 3
        this.projX = 1
        this.projY = 1
        this.x = 1
        this.y = 1
        this.z = 1
        this.size = 1

    }

    project() {
        const { radius:rad, depth, maxSize, minSize, center} = GSM[this.memoId]

        this.x = rad * sin(this.phi) * cos(this.theta) 
        this.y = rad * cos(this.phi) 
        this.z = rad * sin(this.phi) * sin(this.theta) + rad

        this.projScale = depth/ (depth+ this.z)
        this.projX = (this.x * this.projScale) + center.x
        this.projY = (this.y * this.projScale) + center.y

        this.size = mapNums(this.z, 0, depth, maxSize, minSize)
        this.alpha = mapNums(this.z, 0, depth, 1, 0)
    }
    move() {
        this.theta += 0.01 * GSM[this.memoId].rotHorizontal
        this.project()
    }
}

/** Shape class
 * each initialisation has complete unique events which react in a unique way
 */
// todo all this value in a (default value) object, so that all data is stored in GSM #completely_go_cloud




const contrast = 1
const noiseScale = 920
let zoomlvl = 1











class Shape {
    constructor(args={}, myId, otherShapeIds=[], zindex) {
        // id used for identification in memory and events
        this.id = myId
        const defaultValues  = {
            zIndex: zindex,
            otherShapes: otherShapeIds,
            depth: 900,
            minDepth: 0,
            center: { x: Xmid, y: Ymid },
            rotHorizontal: .5,
            rotHVertical: 1,
            radius: 300,
            maxSize: 15,
            minSize: 3,
            amount: 4220,
            noiseScale: .9,
            df: 1500,
            zoff: 100,
            zoffAmount: .003,
            events:  {
                global: 1,
                zoffAmount: 0.001,
                rotHorizontal:0.2,
                depth:10,
                radius:20, 
            },
            preferdShape: preferdShapes[1],
            colorMode: colorModes[2],
            shapeStyle: shapeStyles[0],
            hueRotation: 0,
            hueScale: 360,
        }
        // updates this shape by its arguments
        for (let [key, val] of Object.entries(args)) {
            if(defaultValues[key] != undefined) {
                if(Object.is(val)) {
                    for (let [k, v] of Object.entries(val)) {
                        defaultValues[key][k] = v
                    }
                }
                else defaultValues[key] = args[key]
            }
        }

        // copies all values/settings to global memory
        GSM.new(this.id, Object.copy(defaultValues, true))

        // intis points
        this.points = [...new Array(GSM[this.id].amount)].map((i, idx) => new Point(idx, this.id))

        //assigns colors to points
        this.points.forEach((i, id) => {
            i.move()
            i.color = GSM[this.id].hueScale*i.alpha
        })

        // init events (ads id, so events for each shape are not mixed)
        if(defaultValues.events) Events.setKeys([
            ["r", ()=>{
                GSM.reset(this.id)
            }],
            ["ArrowLeft", ()=>{
                GSM[this.id].rotHorizontal -= GSM[this.id].events.rotHorizontal*GSM[this.id].events.global}],
            ["ArrowRight", ()=>{
                GSM[this.id].rotHorizontal += GSM[this.id].events.rotHorizontal*GSM[this.id].events.global}],
            ["ArrowUp", ()=>{
                GSM[this.id].zoffAmount -= GSM[this.id].events.zoffAmount*GSM[this.id].events.global}],
            ["ArrowDown", ()=>{
                GSM[this.id].zoffAmount += GSM[this.id].events.zoffAmount*GSM[this.id].events.global}],
            ["z", ()=>{
                GSM[this.id].depth += GSM[this.id].events.depth*GSM[this.id].events.global}],
            ["s", ()=>{
                GSM[this.id].depth -= GSM[this.id].events.depth*GSM[this.id].events.global}],
            ["+", ()=>{
                GSM[this.id].radius += GSM[this.id].events.radius*GSM[this.id].events.global}],
            ["-", async()=>{
                GSM[this.id].radius -= GSM[this.id].events.radius*GSM[this.id].events.global}],             
            ], this.id)
        
            defaultValues.clear()

    }

    showMovement() {
        this.points = this.points.sortAc('projScale')

        this.points.forEach((i, pidx,) => {
            i.move()
            if(i.projX > Xmax || i.projY > Ymax || i.projX < Xmin || i.projY < Ymin ) return
            //const {zoff, colorMode:clMod, hueRotation, shapeStyle} = GSM[this.id]
            
            const {df, shapeStyle, colorMode, hueScale, hueRotation, zoff, otherShapes, noiseScale, zIndex, preferdShape} = GSM[this.id]

            //const {zoff, colorMode:clMod, hueRotation, shapeStyle} = GSM[id]
            const c = colorMode==colorModes[2] ? hueScale * i.alpha :  i.color
            let thisColor = colorMode ?   hsl(overcount(c+hueRotation, hueScale), (colorMode ?50:0), 100 - 98 * posInt(i.alpha), 0.6)   : "#1111119f"

            const isAmorf = true
            // simplex3 or perlin3
            let value = noise.perlin3(  i.x/df * (isAmorf?tanh(i.x):1),  i.y/df * (isAmorf?tanh(i.y):1),  zoff)
            const angle = ((1 + value) * 1.1 * 128) / (PI * 2)
            const v = rotateVector(i.projX * noiseScale, i.projY, angle)


            let colVal = noise.simplex3 (i.projX/noiseScale, i.projY/noiseScale, zoff + cos(i.projX*i.projY*zoomlvl))
            colVal = (1 + colVal) * 1.1 * (128 * contrast)
            colVal = scaleNum(colVal, 4, 290, 0, 100) 
             
           // window.zalm.push(colVal)

            // if point is under another
            // if(otherShapes) for(let n of otherShapes){
            //     const cs = GSM[n]
            //     if(zIndex > cs.zIndex) {
            //         const dis = closeTo({x:i.projX, y:i.projY}, cs.center, cs.radius)
            //         if(dis) {
            //             const m = sqrt(dis.x * dis.y) / cs.radius / 2
            //             thisColor = hsl(0, 0, m, 0.1)
            //         }
            //     }
            // }
            rect(i.projX-v.x, i.projY-v.y, i.projX+v.x, i.projY+v.y,  hsl(0, colVal, colVal))
        })
    }
    animate() {
        this.showMovement()
        GSM[this.id].zoff += GSM[this.id].zoffAmount
    }
}




 
async function main() {
    ctx.invert()
    const rawShapes = [
        {
            radius: 400,
            events: {
                global:-1
            },
            preferdShapes: "matrix",
            shapeStyles: "sphere",
            colorModes: "byId"
        },
        // {
        //     color: true,
        //     radius: 600,
        //     amount: 8000,
        //     depth: 1400,
        //     noiseScale: 2,
        //     center: {
        //         x: 300,
        //         y: 300
        //     },
        //     preferdShape: "lines",
        //     zoffAmount: -0.003,
        // }
    ]
    // creates ids
    const ids = range(rawShapes.length).map(i=>getUniqueId())
    await sleep(1)
    // assigns shapes with id, and id's of other shapes
    const shapes = rawShapes.map((i, idx)=>new Shape(i, ids[idx], ids.filter(id=>{
        if(id != ids[idx]) return id
    }), idx))
    // removes ids for security reasons
    ids.clear()

    async function animation() {
        clear()
        shapes.forEach(n=>n.animate())
        await pauseHalt()
        if(!exit) requestAnimationFrame(animation)
    }

    animation()
}


main()
