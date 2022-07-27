const w = cnv.width //= document.body.offsetWidth;
const h = cnv.height // = document.body.offsetHeight;

const gs = 20
const cols = Math.floor(w / gs) + 1;
const ypos = Array(cols).fill(0);
const msgMlen = gs
const decodeY = Ymid + 100
const packageSpeed = 20
const FPS = 100
const activePackages = new Map()

let DONE = false

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, w, h);
ctx.dark()
ctx.fillStyle = '#0f0';
ctx.font = '15pt monospace';


const PackageManager = {
    checksum: "0",
    get() {
        this.checksum = addHex(this.checksum, "1")
        const data = ["l", "r", "u", "d"][randint(3)]
        this.i++
        return {
            checksum: this.checksum,
            data: strToBin(data)
        }
    }
}

function sendingPackage() {
    const intv = setInterval(() => {
        if(pause)return
        if (!DONE && !exit) {
            activePackages.set(activePackages.size, new Package(activePackages.size))
        } else {
            window.clearInterval(intv)
        }
    }, packageSpeed)
}


const Shape = {
    x: Xmid,
    y: Ymax-200,
    cl: "red",
    speed: 10,
    size: 40,
    reset() {
        this.x =Xmid
        this.y =Ymax-200
        this.cl ="red"
    },
    update(pos) {
        if(pos==="l") this.x -= this.speed
        else if(pos==="r") this.x += this.speed
        else if(pos==="u") this.y -= this.speed
        else if(pos==="d") this.y += this.speed

        if(this.y>Ymax || this.y<Ymin) this.reset()
        else if(this.x>Xmax || this.x<Xmin) this.reset()

    },
    show() {
        point(this.x, this.y, this.size, "red")
    }
}

function removePackage(id) {
    activePackages.set(id, null)
}



class Package {
    constructor(id) {
        this.id = id
        this.x = (randint(cols) + 1) * gs
        this.data = PackageManager.get().data.split('')
        this.y = (msgMlen * gs * -1) - gs
        this.minY = this.data.length * gs * -1
        this.decoded = []
        this.query = []
        this.finishedService = false

        if (!this.data.length) {
            this.die()
            this.finishedService = true
        }
    }
    move() {
        if (this.finishedService) return 

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
            Shape.update(this.decoded.shift())
        }
    }

    die() {
        removePackage(this.id)
    }
    // decodes binary's, load in query until size is 8 (chosen binary size)
    decode() {
        if (this.query.length < 8) {
            ctx.fillStyle = hsl(20, 0, 50)
            ctx.fillText(this.bin8(this.query.join("")), this.x, decodeY + gs);
            return
        }
        this.decoded.push(this.bin8(this.query.join("")))
        this.query = []
    }
    // bin8 big brother of Bin Laden
    bin8(str) {
        return str.replace(/\d+./g, char => String.fromCharCode(`0b${char}`))
    }
}


activePackages.set(0, new Package(0))
Events.setKey("c", ()=>activePackages.clear())

async function matrix() {
    clear()
    rect(0, decodeY, w, h, false, "#0f01")
    shade()
    activePackages.forEach(i => i? i.move():"");
    Shape.show()

    await pauseHalt()
    await sleep(0.06)
    requestAnimationFrame(matrix)
}

matrix()
sendingPackage()