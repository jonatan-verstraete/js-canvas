class Particle {
    constructor(x = randint(Xmax), y = randint(Ymax)) {
        this.pos = new Vector(x, y)
        this.vel = new Vector(0, 0)
        this.acc = new Vector(0, 0)
        this.velLimit = 4;
        this.lastPos = this.pos
    }

    render() {
        if (this.vel.x < this.velLimit && this.vel.y < this.velLimit) {
            this.vel.x += this.acc.x;
            this.vel.y += this.acc.y;
        }
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.edges()
        point(this.pos.x, this.pos.y, 5, "darkblue");
    };

    follow(vectors) {
        let x = floor(this.pos.x / scale)
        let y = floor(this.pos.y / scale)
        let idx = x + y + cols
        this.applyForce(vectors[idx])
    }

    applyForce(f) {
        // forEachObj(f, (k, v, obj)=>obj[k] /=1000)
        log("|acc:",this.acc.x, this.acc.y, "|pos:",this.pos.x, this.pos.y, "|f:", f.x, f.y)

        this.pos.x += f.x // scale
        this.pos.y += f.y // scale
        
    };

    edges() {
        if (this.pos.x >= Xmax) this.pos.x = Xmin;
        if (this.pos.x <= Xmin) this.pos.x = Xmax;
        if (this.pos.y >= Ymax) this.pos.y = Ymin;
        if (this.pos.y <= Ymin) this.pos.y = Ymax;
    };
}