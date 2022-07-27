class Ant {
    constructor(x, y, colony) {
        this.colony = colony
        this.x = x
        this.y = y
        this.size = VIEW.size * 20
        this.orientation = 0
        this.bodyMovement = 0
        this.speed = {
            x: randfloat(-2, 2),
            y: randfloat(-2, 2)
        }

        this.color = "cyan"//colony.flag
        this.stroke = "green"//VIEW.filled ? null : this.color 
        this.fill = VIEW.filled ? this.color  : null

        this.target = null
        this.lastTarget = null

        this.lineOfSignt = 20
        this.load = 0
        this.strength = 1

        this.blinkingVelocity = 0
    }
    drawBody() {
        // draw back
        let x, y;
        ({x, y} = posByAngle(this.x, this.y, this.orientation+this.bodyMovement*.6, this.size*-1.6));
        ellipse(x, y, this.size, this.size*0.7, this.orientation+this.bodyMovement, 0, PI2, this.stroke, this.fill);

        // draw middle
        ellipse(this.x, this.y, this.size, this.size*0.2, this.orientation+this.bodyMovement/2, 0, PI2, this.stroke, this.fill);

        // head 
        ({x, y} = posByAngle(this.x, this.y, this.orientation+this.bodyMovement/2, this.size*1.4));

        // jaws
        const a = x;
        const b = y;
        // draw more detailed
        if(VIEW.detail > 2) {
            // draw jaws 

            ctx.lineWidth = this.size/10;
            ({x, y} = posByAngle(a, b, this.orientation+0.3+this.bodyMovement, this.size/2));
            ellipse(x, y, this.size*0.1, this.size*0.1, this.orientation+this.bodyMovement*2, PI2, PI, this.fill);
    
            ({x, y} = posByAngle(a, b, this.orientation-0.3-this.bodyMovement, this.size/2));
            ellipse(x, y, this.size*0.1, this.size*0.1, this.orientation-this.bodyMovement*2, PI, PI2, this.fill);

            if(VIEW.detail > 1) {
                // draw receptors
                let noiseVal = VIEW.detail > 2 ? autoNoise(a, b) : 1;
                let receptorMove = this.bodyMovement*noiseVal*5
                let {x:rx1, y:ry1} = posByAngle(a, b, this.orientation-0.7-receptorMove, this.size*0.8);
                let {x:rx2, y:ry2} = posByAngle(a, b, this.orientation-0.5-receptorMove, this.size*1.5);

                // draw receptor
                ctx.beginPath();
                ctx.moveTo(a, b);
                ctx.lineTo(rx1, ry1);
                ctx.lineTo(rx2, ry2);
                ctx.stroke();

                noiseVal = VIEW.detail > 2 ? autoNoise(b, a) : 1;
                receptorMove = this.bodyMovement*noiseVal*5;
                ({x:rx1, y:ry1} = posByAngle(a, b, this.orientation+0.7+receptorMove, this.size*0.8));
                ({x:rx2, y:ry2} = posByAngle(a, b, this.orientation+0.5+receptorMove, this.size*1.5));

                ctx.beginPath();
                ctx.moveTo(a, b);
                ctx.lineTo(rx1, ry1);
                ctx.lineTo(rx2, ry2);
                ctx.stroke();
            }
        }
        ctx.lineWidth=5;
        // draw head last -> on top of jaws
        ellipse(a, b, this.size*0.5, this.size*0.4, this.orientation+this.bodyMovement, 0, PI2, this.stroke, this.fill);

        // draw eyes
        if( VIEW.detail > 2) {
            ctx.lineWidth=floor(this.size/20)
            if(floor(autoNoise(a, b)*100)%100==0) {
                this.blinkingVelocity = 1
            }
            this.blinkingVelocity -= this.blinkingVelocity>0 ? 0.1 : 0

            const s = this.size/20;
            const {x:x1, y:y1} = posByAngle(a, b, this.orientation+0.5, this.size/4);
            const {x:x2, y:y2} = posByAngle(a, b, this.orientation-0.5, this.size/4);
            const eyeCol = hsl(0, 0, 100-smoothSquareWave(this.blinkingVelocity, 0.5)*80)
            circle(x1, y1, s, "black", eyeCol);
            circle(x2, y2, s, "black", eyeCol);
        }


    }

    drawLegs() {
        const legMoveA = smoothSquareWave(((this.orientation*100)+this.x+this.y)/14, 0.5)/5
        const legMoveB = smoothSquareWave(((this.orientation*100)+this.x+this.y)/14*-1, 0.5)/5

        // back to front, walk in pairs of 3
        // right
        this.#drawLeg(this.orientation- 1   + legMoveA, -legMoveA*2.5, true)
        this.#drawLeg(this.orientation- 1.5 + legMoveB, -legMoveB*2.5)
        this.#drawLeg(this.orientation- 2   + legMoveA, -legMoveA*2.5, true)
        // left
        
        this.#drawLeg(this.orientation+ 1   - legMoveB, legMoveB*2.5)
        this.#drawLeg(this.orientation+ 1.5 - legMoveA, legMoveA*2.5, true)
        this.#drawLeg(this.orientation+ 2   - legMoveB, legMoveB*2.5)
        ctx.fillStyle = this.fill
    }
    #drawLeg(angle, endAngle=1, dev1) {
        if(VIEW.DEV) {
            if(dev1) ctx.fillStyle = "red"
            else ctx.fillStyle = "blue"
        }


        const leggSize = this.size*0.5//*0.3
        const {x:x1, y:y1} = posByAngle(this.x, this.y, angle-leggSize, this.size)
        const {x:x2, y:y2} = posByAngle(this.x, this.y, angle+leggSize, this.size)
        const {x:cx, y:cy} = posByAngle(this.x, this.y, angle+endAngle, this.size*4)

        ctx.beginPath();
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(x1, y1)
        ctx.lineTo(cx, cy)
        ctx.lineTo(x2, y2)
        ctx.closePath()
        this.fill ? ctx.fill() : ctx.stroke()
    }
    draw() {
        this.#move()


        this.bodyMovement = sin(((this.orientation*100)+this.x+this.y)/10)*0.1
        if(this.orientation>=6.2)this.orientation=0

        if(this.fill) {
            ctx.fillStyle=this.color
        } else if(this.stroke) {
            ctx.strokeStyle=this.stroke
        }

        if(!VIEW.detail){
            ctx.lineWidth = this.size/20
            ctx.fillStyle = this.color
            const {x, y} = posByAngle(this.x, this.y, this.orientation, this.size)
            const {x:p1x, y:p1y} = posByAngle(this.x, this.y, this.orientation-0.3, this.size/2)
            const {x:p2x, y:p2y} = posByAngle(this.x, this.y, this.orientation+0.3, this.size/2)

            ctx.beginPath()
            ctx.moveTo(x, y);
            ctx.lineTo(p1x, p1y);
            ctx.lineTo(p2x, p2y);
            ctx.closePath()
            ctx.fill();

            // square(this.x, this.y, this.size, null, this.color, {centered:true})
            // const {x, y} = posByAngle(this.x, this.y, this.orientation, this.size*0.7)
            // point(x, y, this.size*0.8,  this.color)
        } else {
            this.drawLegs()
            this.drawBody()
        }
    }
    #move() {
        // reached border
        if (this.x > Xmax) this.speed.x *= -1
        if (this.y > Ymax) this.speed.y *= -1
        if (this.x < Xmin) this.speed.x *= -1
        if (this.y < Ymin) this.speed.y *= -1

        //this.checkFood()
        // if returned to colony
        if(this.load && distanceTo(this, this.home) < this.home.size) {
            this.target = this.lastTarget
            this.home.update(this.load)
            this.load = 0
        }
        // persue target
        if (this.target) {
            const { x, y } = posTowards(this, this.target, this.speed)
            this.x += x
            this.y += y
        // wonder
        } else {
            this.orientation += 0.01
            // this.x += this.speed.x
            // this.y += this.speed.y
        }
    }
}



