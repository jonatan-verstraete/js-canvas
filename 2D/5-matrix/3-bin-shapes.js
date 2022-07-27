const w = cnv.width //= document.body.offsetWidth;
const h = cnv.height // = document.body.offsetHeight;

const gs = 20
const cols = Math.floor(w / gs) + 1;
const ypos = Array(cols).fill(0);
const msgMlen = gs
const decodeY = Ymax - 100
const packageSpeed = 50
const activePackages = new Map()
const packByteSize = 1
const binFomat = 16

let DONE = false
let packageSeeder = null

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, w, h);
ctx.dark()
ctx.fillStyle = '#0f0';
ctx.font = '15pt monospace';



const PackageManager = {
    checksum: "0",
    header: "d(~_=)b|",
    footer: "|^©≈O©",
    exeSign: "π",
    data: [],
    get() {
        if (!this.data.length) return {
            data: ""
        }
        this.checksum = addHex(this.checksum, "1")
        const data = this.data.shift()
        return {
            checksum: this.checksum,
            data: strToBin(data, binFomat)
        }
    },
    recyclePackage() {
        // resycle id's. after the package length, reuse ids. If no init would be done
        for (let [k, v] of activePackages.entries()) {
            if (v === null) return k
        }
        return activePackages.size
    },
    // end 
    setData(d) {
        if (!d) return
        this.data = (d + this.exeSign).split("")
    },
    seedPackages() {
        if(DONE) log("--seeder: useless activation", DONE)
        if (!!packageSeeder) return log("--seeder: already in place", packageSeeder)
        log('-- seeder init')

        const seed = ()=> {
            if (pause || !window.isFocussed()) return
            if (!exit && !DONE) {
                const id = this.recyclePackage()
                activePackages.set(id, new Package(id, this.get()))

            } else this.stopSeed()
            
        }
        packageSeeder = setInterval(seed, packageSpeed)
    },
    stopSeed() {
        log('seeder: OFF', DONE, exit)
        window.clearInterval(packageSeeder)
        packageSeeder = null
    }
}


const PackageReciever = {
    recievedData: "",
    clear() {
        this.recievedData = ""
    },
    update(part) {
        if (part === PackageManager.exeSign && !DONE) {
            eval(this.recievedData)()
            // DONE = true
            return
        }
        this.recievedData += part
    }
}

function removePackage(id) {
    activePackages.set(id, null)
}






class Package {
    constructor(id, packData) {
        // id used to remove itself if done
        this.id = id
        // binary data
        this.data = packData.data.split('')
        this.packageSize = this.data.length

        this.x = (randint(cols) + 1) * gs
        this.y = (msgMlen * gs * -1) - gs
        // start y at the inverted y of our data length
        this.minY = this.data.length * gs * -1
        // decoded parts
        this.decoded = []
        // the binarys that have arrived but are not yet in full format
        this.query = []
        this.finishedServices = false

        if (!this.data.length) {
            this.die()
        }
    }
    move() {
        if (this.finishedServices) return

        this.y += gs
        const wl = this.data.length

        // show rain
        this.data.forEach((w, idx) => {
            idx += 1
            ctx.fillStyle = hsl(120, 50, ((100 / wl) * idx))
            ctx.fillText(w, this.x, this.y + (gs * idx));
        })
        // show converted rain
        if (wl === 0 || this.x >= decodeY) {
            this.decoded.forEach((w, idx) => {
                idx += 1
                ctx.fillStyle = hsl(120, 50, 50)
                ctx.fillText(w, this.x, this.y + (gs * idx));
            })
        }

        // nothng to decode left
        if (!this.decoded.length && !this.data.length) {
            this.die()
        }

        // reached translation line
        if (this.y >= decodeY - (wl * gs) - gs && wl) {
            this.query.push(this.data.shift())
            this.decode()
        }

        // reached end
        if (this.y >= h) {
            const d = this.decoded.shift()
            if (d && !DONE) PackageReciever.update(d)
        }
    }

    die() {
        removePackage(this.id)
        this.finishedServices = true
    }
    // decodes binary's, load in query until size is $binFomat
    decode() {
        if (this.query.length < binFomat) {
            ctx.fillStyle = hsl(120, 50, 90)
            ctx.fillText(this.binPreview(this.query.join(""), binFomat), this.x, decodeY + gs);
            return
        }
        this.decoded.push(binToStr(this.query.join(""), binFomat))
        this.query = []
    }
    binPreview(str) {
        return str.replace(/\d+./g, char => String.fromCharCode(`0b${char}`))
    }
}





function showDecoded() {
    const padding = 150
    const lineHeight = 20

    let x = padding
    let y = decodeY + lineHeight
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

async function matrix(fresh=false) {
    if(fresh) DONE=false
    clear()
    showDecoded()
    rect(0, decodeY, w, h, false, "#0f01")
    shade()
    activePackages.forEach(i => i ? i.move() : "");

    await pauseHalt()
    requestAnimationFrame(matrix)
}

function init() {
    DONE = false
    PackageReciever.clear()
    activePackages.clear()
    PackageManager.setData(dataFunc.get())
    PackageManager.seedPackages()
    log('--initted')
}

const main = async () => {
    matrix()
    init()
}

Events.setKey("c", () => activePackages.clear())
Events.setKey("r", () => window.location.reload())


main()
