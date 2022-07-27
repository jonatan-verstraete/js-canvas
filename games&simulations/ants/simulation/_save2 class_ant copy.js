class Ant {
    constructor(colony) {
        this.colony = colony
        this.x = colony.base.x
        this.y = colony.base.y, 
        this.size = VIEW.size * 5
        this.orientation = 0
        this.minSpeed = randfloat(0.2, 0.4)
        this.speed = 5

        this.color = colony.flag

        // current physical direction to walk to
        this.target = null
        // the posisioin of the taret, ant adusts position towards target
        this.posTarget = null

        // like home or food instinct way, conceptual target.
        this.initalTarget = posByAngle(this.x, this.y, degRad(randint(360)), Xmax*Ymax)

        this.lastTarget = null
        this.endPoint = {}

        this.lineOfSignt = 30
        this.load = 0

        this.scentInterval = randint(1, 10)
        this.accuracy = 1//randfloat(0.1, 1)
        this.pheromone = null
    }
    #draw() {
        ctx.fillStyle=this.color
        ctx.strokeStyle=this.color

        if(!VIEW.detail) return this.#drawDirectionOnly()
        

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

    #drawLeg(angle, endAngle=1, dev1) {
        if(VIEW.DEV) {
            if(dev1) ctx.fillStyle = "red"
            else ctx.fillStyle = "blue"
        }
        const {x:x1, y:y1} = posByAngle(this.x, this.y, angle, this.size)
        const {x:cx, y:cy} = posByAngle(this.x, this.y, angle+endAngle, this.size*2)

        ctx.beginPath();
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(x1, y1)
        ctx.lineTo(cx, cy)
        ctx.stroke()
    }
    #drawDirectionOnly() {
        ctx.lineWidth = this.size/20
        ctx.fillStyle = this.color
        const {x:sx, y:sy} = posByAngle(this.x, this.y, this.orientation, this.size*-1.6)
        const {x:tx, y:ty} = posByAngle(this.x, this.y, this.orientation, this.size*1.4)
        const {x:p1x, y:p1y} = posByAngle(this.x, this.y, this.orientation-0.5, this.size*4)
        const {x:p2x, y:p2y} = posByAngle(this.x, this.y, this.orientation+0.5, this.size*4)

        ctx.beginPath()
        ctx.moveTo(sx, sy);
        //ctx.lineTo(x, y);
        ctx.lineTo(p1x, p1y);
        ctx.lineTo(tx, ty);
        ctx.lineTo(p2x, p2y);
        //ctx.lineTo(x, y);
        ctx.closePath()
        ctx.fill();
    }

    #wander(angle) {
        log("wander")
        this.target = posByAngle(this.x, this.y, angle||degRad(randint(270)), randint(this.size, this.size*10))
    }
    #lookForDirections() {
        /** what is my next target? */
        log('looking for directoin')
        // FOOD TARG, options: 1. always go to target. 2. update target to every found food.
        // use opt 1. is easiest
        this.itemsInSight = GRID.getPointsInRange(this.x, this.y, this.lineOfSignt)
        
        if(!this.initalTarget) {
            // check for food
            for(let i of this.itemsInSight) {
                if(i.food) {
                    const dt = this.distanceTo(this, i)
                    const di = this.distanceTo(this, this.target)
                    if(di<dt) this.target = i
                    log('-food in sight')
                }
            }
            // check for tracks
            if(!this.target.food) {
                for(let i of this.itemsInSight) {
                    if(i.track) {
                        this.target = i
                        log('-track in sight')
                    }
                }
            } else {
               // this.initalTarget = this.target
            }
        } else {
            TURN_TOWARDS_INITAL_TARGET()
        }
    }
    #evaluatePosition() {
        /** has it reached a certain point or not */
        if(!this.target) this.#wander()

        this.disTarg = distanceTo(this, this.target)
        this.disInitTarg = this.initalTarget ? distanceTo(this, this.initalTarget) : Infinity
        // reached inital target, food or colony
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
        } else if(this.disTarg<=this.speed) {
            log(this.x, this.y, this.target)
            return this.#lookForDirections()
            this.disTarg = distanceTo(this, this.target)
        }

    }
    #move() {
        this.#evaluatePosition()
        // add accuracy adjusment *this.accuracy
        const {x, y, a} = posTowards(this, this.target, this.speed)
        if(this.x + x > Xmax || this.y + y> Ymax || this.x +x < Xmin || this.y + x < Ymin) {
            return this.#wander(a*-1)
        }
        this.x += x
        this.y += y
        this.orientation = a
    }
    live() {
        this.#move()
        this.#draw()
    }
}
const a = new Ant({base: {x:200, y:200, flag: "red"}})


const animation = async()=> {
    clear()
    a.live()
    await sleep(0.5)
    requestAnimationFrame(animation)
}

animation()