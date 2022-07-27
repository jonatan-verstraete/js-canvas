/** setup */
const w = cnv.width
const h = cnv.height

const gs = 20
const cols = Math.floor(w / gs) + 1;
const ypos = Array(cols).fill(0);
const msgMlen = gs
const YdecodeLine = Ymax - 100
const packageSpeed = 200
const activePackages = []
const packageSize = 10 
const binFomat = 16 // 16 is minimum

let DONE = false
let packageSeeder = null

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, w, h);
ctx.dark()
ctx.fillStyle = '#0f0';
ctx.font = '15pt monospace';

document.head.insertAdjacentHTML("beforeend", `<style>
    #canvas_01 {
        transform: perspective(1200px) rotateX(10deg) scale(1.1, 1.1);
        margin-bottom: -100rem;
        -webkit-box-reflect: below;
        color:"";
        border: 10px solid green;
    }
    #canvas_02 {
        margin-top: 100vh;
        transform: perspective(800px) rotateX(220deg);
        /* -webkit-box-reflect: below; */
        color:""
    }
    .newCanvas {
        width: 100vw !important;
    }
</style>`)



/** controls which and when packages are being sent */
const PackageSender = {
    data: [],
    dataSize: 0,
    get(amount = packageSize) {
        if (!this.data.length) return {
            data: []
        }
        // converts pks's to ching-signs
        const data = this.data.splice(0, amount).map(i=>UTFpointEncoder.chingConverter(str(i)).sign)

        return {
            data: data,
            length: data.length
        }
    },
    setData(d) {
        this.dataSize = d.length
        this.data = (d).split("")
    },
    seedPackages() {
        if (!!packageSeeder) return
        let timeout = 0
        const seed = () => {
            if(timeout>100) {
                this.stopSeed()
                exitting("seeder timeout")
            }
            if (pause || !window.isFocussed() || !this.data.length) return timeout++
            timeout = 0
            if (!exit && !DONE) {
                activePackages.push(new Package(this.get()))

            } else this.stopSeed()
        }
        packageSeeder = setInterval(seed, packageSpeed)
    },
    stopSeed() {
        window.clearInterval(packageSeeder)
        packageSeeder = null
    }
}

/** stores all recieved packages and executes when needed */
const PackageReciever = {
    recievedData: "",
    clear() {
        this.recievedData = ""
    },
    update(pkgMsg) {
        // converts ching-signs back to readable pkg's
        const decoded = pkgMsg.split('').map(i=>UTFpointEncoder.chingConverter(i, false).sign).join('')
        this.recievedData += decoded

        if (this.recievedData.length === PackageSender.dataSize) {
            eval(this.recievedData)()
            // DONE = true
            return
        } 
    }
}

/** package moves and when target is reached it gives its message to the PackageReciever  */
class Package {
    constructor(packData) {
        // binary data
        this.data = packData.data
        this.packageSize = this.data.length

        this.x = (randint(cols) + 1) * gs
        this.y = (msgMlen * gs * -1) - gs
        // start y at the inverted y of our data length
        this.minY = this.data.length * gs * -1

        this.query = []
        this.finishedServices = false

        if (!this.data.length) {
            this.die()
        }
    }
    move() {
        if (this.finishedServices) return
        const dl = this.data.length

        // no more data to convert
        if (!dl) return this.die()

        // reached y end 
        if (this.y >= YdecodeLine && dl) {
            this.query.push(this.data.shift())
        }

        // show rain
        this.data.forEach((w, idx) => {
            idx += 1
            ctx.fillStyle = hsl(120, 50, ((100 / dl) * idx))
            ctx.fillText(w, this.x, this.y + (gs * idx));
        })
        this.y += gs
    }
    die() {
        // removes itself from active packages
        if (!this.finishedServices) {
            PackageReciever.update(this.query.join(""))
            activePackages.shift()
        }
        this.finishedServices = true
    }
}


const UTFpointEncoder = {
    ching: 20000,
    chingConverter(str, encode = true) {
        const codepoint = this.encode(str) + (encode ? this.ching : -this.ching)
        const sign = this.decode(codepoint)
        const binary = strToBin(sign, binFomat)
        return {
            bin: binary,
            sign: sign,
            point: codepoint,
        }
    },
    decode(int) {
        return String.fromCodePoint(int)
    },
    encode(str) {
        return str.codePointAt(0)
    },
}


function showDecoded() {
    const padding = 150
    const lineHeight = 20
    let x = padding
    let y = YdecodeLine + lineHeight
    ctx.fillStyle = hsl(120, 50, 60)
    PackageReciever.recievedData.split("").forEach((i, idx) => {
        idx += 1
        ctx.fillText(i, x, y);
        x += 10
        if (x >= Xmax - padding) {
            x = padding
            y += lineHeight
        }
    })
}

async function matrix(fresh = false) {
    if (fresh) DONE = false
    clear()
    showDecoded()
    rect(0, YdecodeLine, w, h, false, "#0f01")
    shade()
    for(let i of activePackages) i.move()
    //activePackages.forEach(i => i.move());
    //await sleep()
    await pauseHalt()
    requestAnimationFrame(matrix)
}

function init() {
    DONE = false
    PackageReciever.clear()
    activePackages.length = 0
    PackageSender.setData(dataFunc.get())
    PackageSender.seedPackages()
    log('--initted')
}

const main = async () => {
    Events.setKey("r", () => window.location.reload())
    matrix()
    init()
}


main()