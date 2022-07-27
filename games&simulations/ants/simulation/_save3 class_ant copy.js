function adjustPointToOther(src, src2, targ){
    const {x, y}= src
}
class Ant {
    constructor(colony) {
        this.colony = colony
        this.x = colony.base.x
        this.y = colony.base.y, 
        this.size = VIEW.size * 5

        this.minSpeed = randfloat(0.2, 0.4)
        this.speed = 2
        this.color = colony.flag

        // how we are turned/oriented
        this.orientation = degRad(randint(360))
        this.turnspeed = 0.1
        this.turningVelocity = 0


        // ..
        this.target = null

        // like home or food instinct way, conceptual target.
        this.initalTarget = null

        this.lineOfSignt = 30
        this.load = 0

    }
    #draw() {
        ctx.fillStyle=this.color
        ctx.strokeStyle=this.color        

        ctx.lineWidth=floor(this.size/10)
        /** LEGS */
        const legMoveA = smoothSquareWave(((this.orientation*100)+this.x+this.y)/10, 0.5)/8
        const legMoveB = smoothSquareWave(((this.orientation*100)+this.x+this.y)/10*-1, 0.5)/8

        // right
        this.#drawLeg(this.orientation- 1   + legMoveA, -legMoveA*2.5, true)
        this.#drawLeg(this.orientation- 1.5 + legMoveB, -legMoveB*2.5)
        this.#drawLeg(this.orientation- 2   + legMoveA, -legMoveA*2.5, true)
        // left
        this.#drawLeg(this.orientation+ 1   - legMoveB, legMoveB*2.5)
        this.#drawLeg(this.orientation+ 1.5 - legMoveA, legMoveA*2.5, true)
        this.#drawLeg(this.orientation+ 2   - legMoveB, legMoveB*2.5)
        
        /** BODY */
        // back
        let {x, y} = posByAngle(this.x, this.y, this.orientation, this.size*-1.6);
        ellipse(x, y, this.size, this.size*0.7, this.orientation, 0, PI2, null, this.color);
        // middle
        ellipse(this.x, this.y, this.size, this.size*0.2, this.orientation, 0, PI2, null, this.color);
        // head
        ({x, y} = posByAngle(this.x, this.y, this.orientation, this.size*1.4));
        ellipse(x, y, this.size*0.5, this.size*0.4, this.orientation, 0, PI2, null, this.color);


        /** RECEPTORS */
        // 1
        let {x:rx1, y:ry1} = posByAngle(x, y, this.orientation-0.7, this.size*0.8);
        let {x:rx2, y:ry2} = posByAngle(x, y, this.orientation-0.5, this.size*1.5);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(rx1, ry1);
        ctx.lineTo(rx2, ry2);
        ctx.stroke();
        // 2
        ({x:rx1, y:ry1} = posByAngle(x, y, this.orientation+0.7, this.size*0.8));
        ({x:rx2, y:ry2} = posByAngle(x, y, this.orientation+0.5, this.size*1.5));
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(rx1, ry1);
        ctx.lineTo(rx2, ry2);
        ctx.stroke();

        // this.endPoint = {
        //     x:a, 
        //     y:b
        // }

    }
    #drawLeg(angle, endAngle=1) {
        const {x:x1, y:y1} = posByAngle(this.x, this.y, angle, this.size)
        const {x:cx, y:cy} = posByAngle(this.x, this.y, angle+endAngle, this.size*2)
        ctx.beginPath();
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(x1, y1)
        ctx.lineTo(cx, cy)
        ctx.stroke()
    }

    #wander(reverse) {
        if(reverse) this.targetOrientation *= -1
        else {
            this.lastOrientation = this.orientation
            this.targetOrientation = degRad(randint(-90, 90))
        }
        log("wander")

    }

    /** which direction am i going next */
    #lookForDirections() {

        // FOOD TARG, options: 1. always go to target. 2. update target to every found food.
        // use opt 1. is easiest
        this.itemsInSight = GRID.getPointsInRange(this.x, this.y, this.lineOfSignt)
        
        if(!this.target) {
            // const tracks = []
            // const foods = []
            // check for food
            for(let i of this.itemsInSight) {
                point(i.x, i.y, GRID.detail/2, "cyan")
                if(i.food) {
                    log('-food in sight', i)
                }
            }
            // check for tracks
            if(!this.target) {
                for(let i of this.itemsInSight) {
                    if(i.track) {
                        log('-track in sight', i)
                    }
                }
            }
        }
        if(!this.target) this.#wander()
    }

    /** have i reached a certain point or not */
    #evaluatePosition() {

        // mqke sudden turn
        if(randint(30)===1) return this.#wander()
        return

        this.disTarg = distanceTo(this, this.target)
        // reached inital target, food or colony
        if(this.initalTarget) {
            this.disInitTarg = this.initalTarget ? distanceTo(this, this.initalTarget) : Infinity
            if(this.disInitTarg<=this.speed) {
                if(this.initalTarget === this.colony) {
                    log('reached colony')
                    this.colony.food += this.load
                    this.load = 0
                    return this.#wander()
                } else if(this.initalTarget.food) {
                    log('reached food')
                    const name = this.initalTarget.id
                    GRID.map.set(name, GRID.map.get(name).food - 1)
                    this.load = 1
                    this.initalTarget = this.colony
                } else {
                    log('WRONGLY ASSIGNED INTIAL TARGET')
                    log(this.initalTarget)
                    log(this.target)
                    exitting()
                }
                this.initalTarget = null
            }

        // reached current target
        } else if(this.disTarg<=this.speed) {
            log("reached target")
            return this.#lookForDirections()
        }
    }
    #move() {
        // add accuracy adjusment *this.accuracy
        this.#evaluatePosition()

        // adjust orientation towards targetOrientation
        if(this.targetOrientation != null)  {
            this.orientation += this.targetOrientation*this.turnspeed - this.lastOrientation*this.turnspeed
            if(toFixed(this.orientation) === toFixed(this.targetOrientation)) this.targetOrientation=null
        } 

        const {x, y} = posByAngle(null, null, this.orientation, this.targetOrientation?this.speed*0.5:this.speed)

        if(!this.targetOrientation && ((this.x + x) > Xmax || (this.y + y)> Ymax || (this.x +x) < Xmin || (this.y + x) < Ymin)) {
            return this.#wander()
            this.targetOrientation = this.orientation*-1
            log('REVEREse', this.targetOrientation, this.orientation)


        } else {
            this.x += x
            this.y += y
        }

    }
    live() {
        if(!this.ok) this.#wander()
        this.ok = true
        this.#move()
        this.#draw()
    }
}
