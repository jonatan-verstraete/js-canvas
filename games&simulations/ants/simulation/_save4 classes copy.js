const loginfo = (...n)=> {
    if(VIEW.DEV) {
        info(...n)
    }
}
/** general ant class */
class Ant {
    constructor(colony) {
        // basic
        this.colony = colony
        this.x = colony.x
        this.y = colony.y, 
        this.color = COLORS.next()//colony.flag
        this.size = VIEW.size * 5
        // view
        this.orientation = 0
        this.viewWideness = 90
        this.lineOfSight = 50
        // motion
        this.turnspeed = 0.05
        this.minSpeed = randfloat(0.2, 0.4)
        this.speed = 2
        this.target = null
        this.accuracy = 1//randfloat(-1, 1) || randfloat(-1, 1)

        this.boundPadding = 20

    }
    getLineOfSight(){
        const x = floor(this.x)
        const y = floor(this.y)
        const pt = {x:x, y:y}
        const orientation = radDeg(this.orientation)
        const res= []

        for(let _x of range(this.lineOfSight*2).map(i=>floor(x+i-this.lineOfSight))) {
            for(let _y of range(this.lineOfSight*2).map(i=>floor(y+i-this.lineOfSight))) {
                // is grid point
                if( _x % GRID.detail===0 && _y % GRID.detail===0 )  {
                    // is within circular radius
                    if ((_x-x)**2 + (_y-y)**2 <= this.lineOfSight**2) {
                        res.push(GRID.map.get(sCoord(_x, _y)))
                    }
                }
            }
        }
        return res
        // filters point that not fit by angle
        return res.filter(i=> {
            const a = radDeg(posTowards(i, pt).a, true)
            if(inRange(a, orientation, this.viewWideness)) return i
        })
    }
    drawRaw() {
        const {x, y} = posByAngle(this.x,this. y, this.orientation, this.size*2)
        const {x:x1, y:y1} = posByAngle(this.x,this. y, this.orientation-0.7, -this.size)
        const {x:x2, y:y2} = posByAngle(this.x,this. y, this.orientation+0.7, -this.size)

        ctx.strokeStyle = this.color
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.lineTo(this.x, this.y);

        ctx.closePath();
        ctx.stroke();
        if(this.load) point(this.x, this.y, this.size, "green")
    }
    draw() {
        ctx.fillStyle=this.color
        ctx.strokeStyle=this.color        

        ctx.lineWidth=floor(this.size/10)
        /** LEGS */
        const legMoveA = smoothSquareWave(((this.orientation*10)+this.x+this.y)/5, 0.5)/8
        const legMoveB = smoothSquareWave(((this.orientation*10)+this.x+this.y)/5*-1, 0.5)/8

        // right
        this.drawLeg(this.orientation- 1   + legMoveA, -legMoveA*2.5, true)
        this.drawLeg(this.orientation- 1.5 + legMoveB, -legMoveB*2.5)
        this.drawLeg(this.orientation- 2   + legMoveA, -legMoveA*2.5, true)
        // left
        this.drawLeg(this.orientation+ 1   - legMoveB, legMoveB*2.5)
        this.drawLeg(this.orientation+ 1.5 - legMoveA, legMoveA*2.5, true)
        this.drawLeg(this.orientation+ 2   - legMoveB, legMoveB*2.5)
        
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
    drawLeg(angle, endAngle=1) {
        const {x:x1, y:y1} = posByAngle(this.x, this.y, angle, this.size)
        const {x:cx, y:cy} = posByAngle(this.x, this.y, angle+endAngle, this.size*2)
        ctx.beginPath();
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(x1, y1)
        ctx.lineTo(cx, cy)
        ctx.stroke()
    }
    checkOutBounds(){
        if(this.x+this.boundPadding < Xmax && this.y+this.boundPadding < Ymax && this.x-this.boundPadding > Xmin && this.y-this.boundPadding > Ymin) {
            this.outBounds = false
        } else {
            this.outBounds = true
        }
        return this.outBounds
    }
    speadPheromone(){
        this.spreadCount++
        if(this.spreadCount>this.scentInterval) {
            this.spreadCount=0
            if(!this.outBounds && this.target === this.colony) {
                const {x, y}= GRID.getClosest(this.x, this.y)
                const a = GRID.map.get(sCoord(x, y))
                a.pheromone += 1
                a.pheromoneOrientation = (this.orientation-degRad(360))*this.accuracy
            }
        }
    }
}


/** a single working Ant */
class WorkerAnt extends Ant{
    constructor(colony) {
        super(colony)
        // how we are turned/oriented
        this.orientation = degRad(randint(-360, 360))
        // how we want to be oriented
        this.targetOrientation = null

        // {x, y, food, track..}. food or colony or location
        this.load = 0

        this.scentInterval = GRID.detail//randint(1, 10)
        this.spreadCount = 0
        this.accuracy = 1//randfloat(0.1, 1)
        this.pheromone = null

    }
    wander() {
        loginfo('-wander')
        this.lastOrientation = this.orientation
        this.targetOrientation = this.orientation+degRad(randint(-90, 90))
    }

    /** which direction am i going next OR what is my next target */
    searchArea() {
        /* 
            ABOUT:
            - smells food and communicates with antenna
            - perfect scenario: looks around. if foods is are found look for thez bigguest adn closed
            - my way: options: 1. always go to target before anything else. 2. update target to every found food.

            in use: when no target, look for food
        */
        this.itemsInSight = this.getLineOfSight()

        // look in sight
        if(!this.target) {
            let track = 0
            // check for food & pheromone
            for(let i of this.itemsInSight) {
                if(i.food) {
                    this.target = i
                    loginfo('-** found: food')
                }else if(i.pheromone && i.pheromoneOrientation) {
                    loginfo('-** found: track')
                    if(i.pheromone > track) track = i
                }
            }
            // eg. if we found track, but no food
            if(track && !this.target) {
                loginfo('follow path')
                this.target = track
            }
            // if nothing is found
            if(!this.target) {
                this.wander()
            }
        }
    }


    /** have i reached a certain point or not */
    evaluatePosition() {
        // if the ant is out bounderies
        if(this.checkOutBounds()) {
            loginfo('- outbounds -')
            // if(this.x >= Xmax) this.targetOrientation -= mapNums()
            if(this.x >= Xmax) this.x -= this.speed
            if(this.x <= Xmin) this.x += this.speed
            if(this.y >= Ymax) this.y -= this.speed
            if(this.y <= Ymax) this.y += this.speed
            this.orientation += degRad(90)
            return 
        }
       //if(randint(30)===1) return this.searchArea()

        if(this.target) {
            this.disTarg = distanceTo(this, this.target)
            // reached inital target, food or colony
            if(this.disTarg<=this.speed) {
                // reached colony
                if(this.target === this.colony) {
                    loginfo('reached colony')
                    this.colony.foodStorage += this.load
                    this.load = 0
                    this.target = null
                    return this.searchArea()
                // reached food
                } else if(this.target.food) {
                    loginfo('reached food')
                    GRID.map.get(this.target.id).food -= 1
                    this.load = 1
                    this.target = this.colony
                } else if(this.target.pheromone) {
                    loginfo('reached track')
                    this.targetOrientation = this.target.pheromoneOrientation
                    this.target = null
                } else {
                    loginfo('target had no food anymore?')
                    this.target = null
                    return this.wander()
                }
            // move towards target
            } else {
                loginfo('move->target:', this.target.food ? "food": 'Colony')
                this.orientation = posTowards(this, this.target, this.speed).a //+ randfloat(this.accuracy)
            }
            // make sudden move
        } else if(randint(20)===1) return this.searchArea()
    }
    move() {
        this.evaluatePosition()
        this.speadPheromone()

        // reset orientation: if orientation is bigger tahn 360 = 0
        if(this.orientation>6.283185307179586) this.orientation=0

        // turning: adjust orientation towards targetOrientation
        if(this.targetOrientation != null)  {
            this.orientation = this.targetOrientation
            this.targetOrientation=null
            // this.orientation += this.targetOrientation*this.turnspeed - this.lastOrientation*this.turnspeed
            // if(toFixed(this.orientation) === toFixed(this.targetOrientation)) this.targetOrientation=null
        } 



        const {x, y} = posByAngle(null, null, this.orientation, this.targetOrientation?this.speed*0.5:this.speed)

        this.x += x
        this.y += y
    }
    live() {
        this.move()
        this.draw()
        //circle(this.x, this.y, this.lineOfSight, null, "#38F3")
    
        //fillText(toFixed(this.orientation, 1), this.x, this.y, 20, {color: "blue"})
        //this.getLineOfSight().forEach(i=> point(i.x, i.y, GRID.detail/2, i.food ? null : "#222"))   //(i.track ? "#f55" :"#08F3")      
    }
}



/** An ant colony */
class Colony {
    constructor(x, y, col, name) {
        this.x = x
        this.y = y

        this.flag = col || COLORS.random()
        this.ants = range(1).map(i => new WorkerAnt(this))
        this.foodStorage = 0
        this.size = 20
        this.name = name
    }
    live() {
        circle(this.x, this.y, this.size, this.flag, "white")
        ctx.fillStyle = this.flag
        ctx.fillText(this.name, this.x - (this.name.length*3), this.y)
        ctx.fillText("food: "+this.foodStorage, this.x - (this.name.length*3), this.y-20)

        for (let ant of this.ants) ant.live()
    }
}

