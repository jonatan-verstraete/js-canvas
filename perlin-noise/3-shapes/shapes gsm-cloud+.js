// default values, as to give an overview of what is posible
const   preferdShapes = ["lines", "triangles", "circles", "dots", "matrix"],
        colorModes = [null, "byId", "byDepth"],
        shapeStyles = ["sphere", "amorf"];


/** problem: 
 * Some of Shape's values are needed in Point (Point.inherit(Shape), true) solves this)
 * When updating these values (realtime), these need to change in bother objects
 * 
 * old solution: all in one class with a main object √
 * old solution: a unique window varable with shape id √
 * old solution: it should just work wtf!? IT DOES! √
 * CURRENT solution: a globally shared memory  √
 * NEW idea: only globally draw shapes, +sorting Zindexing, +?speed, +coherent visuals, +global setup can apply more easily
 
*/

/** global shape memory or gloablly shared memory */
// works as a local cloud
// todo: add clearance level that only top level shapes can manipulate data and lowerlevels can only acces certain parts of data
// todo: create super values that change all shapes data
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
        this.y = rad * cos(this.phi)  * cos(this.theta) * tan(this.theta)
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

        this.points.forEach((i, idx, arr) => {
            i.move()



            if(i.projX > Xmax || i.projY > Ymax || i.projX < Xmin || i.projY < Ymin ) return
            //const {zoff, colorMode:clMod, hueRotation, shapeStyle} = GSM[this.id]
            
            const {df, shapeStyle, colorMode, hueScale, hueRotation, zoff, otherShapes, noiseScale, zIndex, preferdShape} = GSM[this.id]

            //const {zoff, colorMode:clMod, hueRotation, shapeStyle} = GSM[id]
            const c = colorMode==colorModes[2] ? hueScale * i.alpha :  i.color
            let thisColor = colorMode ?   hsl(overcount(c+hueRotation, hueScale), (colorMode ?50:0), 100 - 98 * posInt(i.alpha), 0.6)   : "#1111119f"

            const isAmorf = (shapeStyle==shapeStyles[1])
            // simplex3 or perlin3
            let value = noise.perlin3(  i.x/df * (isAmorf?tanh(i.x):1),  i.y/df * (isAmorf?tanh(i.y):1),  zoff)
            
            const angle = ((1 + value) * 1.1 * 128) / (PI * 2)
            const v = rotateVector(i.projX * noiseScale, i.projY, angle)

            // if point is under another
            if(otherShapes) for(let n of otherShapes){
                const cs = GSM[n]
                if(zIndex > cs.zIndex) {
                    const dis = closeTo({x:i.projX, y:i.projY}, cs.center, cs.radius)
                    if(dis) {
                        const m = sqrt(dis.x * dis.y) / cs.radius / 2
                        thisColor = hsl(0, 0, m, 0.1)
                    }
                }
            }


            switch(preferdShape) {
                case preferdShapes[0]:// "lines"
                    ctx.lineWidth = i.size / 10
                    line(i.projX, i.projY, i.projX + v.x, i.projY + v.y, thisColor)
                    break;
                case preferdShapes[1]:// "triangles"
                    ctx.fillStyle = thisColor
                    triangle(i.projX+v.x, i.projY+v.y, (v.x-v.y) / 4,{rotate:(angle*(hueScale)), filled:true, sharpness:2})
                    break;
                case preferdShapes[2]:// "circles"
                    circle(i.projX+v.x, i.projY+v.y, (v.x - v.y)*0.2, thisColor)//, "white"
                    break;

                case preferdShapes[3]:// "dots"
                    point(i.projX+v.x, i.projY+v.y, i.size, thisColor)
                    break;
                case preferdShapes[4]:
                    ctx.fillStyle = '#0f0';
                    ctx.font = '15pt monospace';
                    //const ch = String.fromCharCode(Math.random() * 128);
                    const ch = WORDS.random()
                    ctx.fillText(ch, i.projX+v.x, i.projY+v.y, i.size)
                    break;
                default:
                    textCenter('shape not found', 200, "red")
                    log('-- no shape found', preferdShape)
                    exitting("shape not found")
                    break
            }
        })
    }
    animate() {
        this.showMovement()
        GSM[this.id].zoff += GSM[this.id].zoffAmount
    }
}


const WORDS = `
Tyger Tyger burning bright In the forests of the night,
What immortal hand or eye,
Could frame thy fearful symmetry,
In what distant deeps or skies,
Burnt the fire of thine eyes,
On what wings dare he aspire,
What the hand dare seize the fire,
And what shoulder and what art,
Could twist the sinews of thy heart,
And when thy heart began to beat,
What dread hand and what dread feet,
What the hammer what the chain,
In what furnace was thy brain,
What the anvil what dread grasp,
Dare its deadly terrors grasp,
When the stars threw down their spears,
And watered heaven with their tears,
Did he smile his work to see,
Did he who made the lamb make thee,
Tyger Tyger burning bright,
In the forests of the night,
What immortal hand or eye,
Dare frame thy fearful symmetry`.split(',').map(i=>i.split(' ').map(i=>i.replace('\n', ''))).flat()



 
async function main() {
    ctx.invert()
    const rawShapes = [
        {
            radius: 400,
            events: {
                global:-1
            },
            preferdShape: "matrix"
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