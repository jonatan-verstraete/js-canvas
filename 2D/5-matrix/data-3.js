const {
    ctxN: ctx2,
    cnvN: cnv2
} = createCanvas();

ctx2.inherit(ctx)

function clear2() {
    ctx2.clearRect(0, 0, cnv2.width, cnv2.height)
}
function rect2(x1, y1, x2, y2, fill = "#9991", stroke) {
    ctx2.beginPath();
    ctx2.moveTo(x1, y1)
    ctx2.lineTo(x2, y1)
    ctx2.lineTo(x2, y2)
    ctx2.lineTo(x1, y2)
    ctx2.lineTo(x1, y1)

    if (stroke) {
        ctx2.strokeStyle = stroke
        ctx2.stroke()
    }
    if (fill) {
        ctx2.fillStyle = fill
        ctx2.fill();
    }
    ctx2.closePath();
}


function line2(x1, y1, x2, y2, stroke = null) {
    if (stroke) ctx2.strokeStyle = stroke
    ctx2.beginPath();
    ctx2.moveTo(x1, y1);
    ctx2.lineTo(x2, y2);
    ctx2.closePath();
    ctx2.stroke();
}

function shade2(cl = "#1118", x = 1, y = 1, blur = 4) {
    ctx2.shadowColor = cl
    ctx2.shadowOffsetX = x;
    ctx2.shadowOffsetY = y;
    ctx2.shadowBlur = blur;
}

function circle2(x = Xmid, y = Ymid, r = 200, fill) {
    if (r < 0) r *= -1
    ctx2.beginPath();
    ctx2.arc(x, y, r, 0, Math.PI * 2);
    ctx2.fillStyle = fill
    ctx2.fill();
    ctx2.closePath();
}

// depricated for v3
const dataFunc = {
    get() {
        return `()=> {let x = randint(100, ${cnv2.width});let y = randint(100, ${cnv2.height});let s = randint(100, 300);rect2(x, y, x+s, y+s, hsl(randint(360)));init();}`;
    },
};




class PkgItem {
    constructor(id=0) {
        this.id = id
        // f = figure
        this.x = xposs.randomRange(1)[0]
        this.y = 0
        this.fx = randint(cnv2.width);
        this.fy = randint(cnv2.height);
        this.fgs = randint(10) 
        this.fspeedX = toFixed(randfloat(-1,1)*this.fgs);
        this.fspeedY = toFixed(randfloat(-1,1)*this.fgs);
        this.fcl = randint(360);
        this.fs = randint(5, 100);
        this.initalLength = 0
        this.init()
    }
    move(){
        this.y += gs
        this.fx += floor(this.fspeedX);
        this.fy += floor(this.fspeedY);
        let yend = floor(this.fy+this.fs);
        let xend = floor(this.fx+this.fs);
        this.fcl+=10
        rect2(this.fx, this.fy, xend, yend, hsl(overcount(this.fcl, 360)));
    }
    init() {
        this.initalLength = Object.keys(this).map(k=>str(this[k]).split('').map(n=>chingConverter(n))).flat().length
        this.initialY = -(this.initalLength * gs * 2)
        this.y = this.initialY
    }
}





/**

function rotateY(theta = Config.depth/10) {
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);
    for(let [k, v] of activePackages) {
        const {x, y, z} = v
        v.x = x * cosTheta - z * sinTheta;
        v.y = z * cosTheta + x * sinTheta;
    }
}


 */