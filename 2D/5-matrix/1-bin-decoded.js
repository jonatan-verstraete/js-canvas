const w = cnv.width //= document.body.offsetWidth;
const h = cnv.height // = document.body.offsetHeight;

const gs = 20
const cols = Math.floor(w / gs) + 1;
const ypos = Array(cols).fill(0);
const msgMlen = gs
const decodeY = Ymid + 100
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, w, h);
ctx.dark()
ctx.fillStyle = '#0f0';
ctx.font = '15pt monospace';

const MSG = "There was a time where freedom was a wish. There was more anger and hate and fear than ever after man started looking himselves in the mirror. When the world of peace and joy vaped out with time, the void of exitence once more filled itself with blood of the innocent.".split('')
const fullDecoded = []
const packageSpeed = 20
const FPS = 100
let DONE = false
let msgIdx = 0


function getMsg() {
    /** uncommmend to make infinite rain */
    // if(msgIdx>=MSG.length-1) {
    //     msgIdx=0
    //     fullDecoded.length = 0
    // }
    if (!MSG[msgIdx]) {
        DONE = true
        return ""
    }
    const res = strToBin(MSG[msgIdx])
    msgIdx++
    return res
}

function sendingPackage() {
    let intv = setInterval(() => {
        if (!DONE) {
            words.push(new Word(words.length))
        } else {
            window.clearInterval(intv)
        }
    }, packageSpeed)
}





class Word {
    constructor(id) {
        this.id = id
        this.x = (randint(cols) + 1) * gs
        this.word = getMsg().split('')
        this.y = (msgMlen * gs * -1) - gs
        this.minY = this.word.length * gs * -1
        this.decoded = []
        this.query = []
        this.finishedService = false

        if (!this.word.length) {
            this.finishedService = true
        }
    }
    move() {
        if (this.finishedService) return

        this.y += gs
        const wl = this.word.length
        // show rain
        this.word.forEach((w, idx) => {
            idx += 1
            ctx.fillStyle = hsl(120, 50, ((100 / wl) * idx))
            ctx.fillText(w, this.x, this.y + (gs * idx));
        })
        //show converted rain
        if (wl === 0 || this.x >= decodeY) {
            this.decoded.forEach((w, idx) => {
                idx += 1
                ctx.fillStyle = hsl(120, 50, 50)
                ctx.fillText(w, this.x, this.y + (gs * idx));
            })
        }

        // nothng to decode left
        if (!this.decoded.length && !this.word.length) {
            this.die()
        }

        // reached translation line
        if (this.y >= decodeY - (wl * gs) - gs && wl) {
            this.query.push(this.word.shift())
            this.decode()
        }

        // reached end
        if (this.y >= h) {
            fullDecoded.push(this.decoded.shift())
        }
    }

    die() {
        words.splice(this.id, 1, new Word(this.id))
        this.clear()
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





function showDecoded() {
    const padding = 150
    const lineHeight = 20

    let x = padding
    let y = Ymax - padding*1.2
    ctx.fillStyle = hsl(120, 50, 60)

    fullDecoded.forEach((i, idx) => {
        idx += 1
        ctx.fillText(i, x, y);
        x += 10
        if (x >= Xmax - padding) {
            x = padding
            y += lineHeight
        }
    })
}




const words = [new Word(0)]

async function matrix() {
    clear()
    rect(0, decodeY, w, h, false, "#0f00")
    shade()
    words.forEach(i => i.move());
    showDecoded()

    await pauseHalt()
    await sleep(0.06)
    requestAnimationFrame(matrix)
}
matrix()
sendingPackage()