/** Main */
class Effects {
    constructor({
        amp = 150,
        freq = 300,
        space = 0,
        noiseY = 0,
        noiseX = 0,
        cursive = 0,
        direction = -1,
        amount = 1,
        startPointY = Ymax - 400,
        flowMid = startPointY / 2,
        adder = 0,
        horizon = 3000,
        loopLength = 10000,
        linesAmount = 5000,
        innerCircle = true,
        radius = 100,
        circleHeigth = 1,
        circleWidth = 1,
        ballOnly = false,
        speed = 0.01,
        color = 100,
        gradient = true,
        gradientReachMin = 0,
        gradientReachMax = 360,
        gradientCount = 1,
        gradientSpeed = 1,
        movingGradient = false,
        saturation = 40,
        transparency = 0.2,
        grayscale = true,

        } = {}) {
            this.amp = amp
            this.freq = freq
            this.space = space
            this.noiseY = noiseY
            this.noiseX = noiseX
            this.cursive = cursive
            this.direction = direction
            this.transparency = transparency
            this.amount = amount
            this.startPointY = startPointY
            this.flowMid = flowMid
            this.adder = adder
            this.loopLength = loopLength
            this.linesAmount = linesAmount
            this.innerCircle = innerCircle
            this.radius = radius
            this.circleHeigth = circleHeigth
            this.circleWidth = circleWidth
            this.ballOnly = ballOnly
            this.horizon = horizon
            this.speed = speed
            this.color = color
            this.saturation = grayscale ? 0 : saturation
            this.gradient = gradient
            this.gradientReachMin = gradientReachMin
            this.gradientReachMax = gradientReachMax
            this.gradientSpeed  = gradientSpeed 
            this.movingGradient = movingGradient
            this.currentGradient = 0

            


            this.colorModulus = Math.round(this.linesAmount / (gradientReachMax * gradientCount))
            // ctx.shadowOffsetX = 2
            // ctx.shadowOffsetY = 0
            // ctx.shadowBlur    = 0
            //ctx.shadowColor = "#ff00002f"
            ctx.strokeStyle = `hsla(${this.color},${saturation}%,50%,${transparency})`;
            ctx.lineWidth = 0.3

            this.a = 0
            this.b = 0
            this.randomness = 0


    }

    async lettersHorizon(data = []) {
        if(data.length == 0) return
        this.transparency = 0.3
        this.lineWidth = 2   

        return await this.#main(()=> {
            ctx.moveTo(Xmid, Ymax - Math.cos(this.x ) * (this.a))
            // ctx.lineTo(this.a, Math.tan(this.randomness) * this.randomness)
            ctx.lineTo(data[this.i].x , data[this.i].y)
        })
    }

    async lettersCircle(data = []) {
        if(data.length == 0) return
        this.transparency = 0.6
        this.lineWidth = 1 
        this.radius = 350 
        this.loopLength = 1000
        this.linesAmount = data.length 
        //this.grayscale = true 
        return await this.#main(()=> {


            const angle = ((Math.PI * 2) * (this.b - this.randomness))
            const a1 = Math.cos(angle) * this.radius * this.circleHeigth
            const a2 = Math.sin(angle) * this.radius * this.circleWidth
            
            let iSave = overcount(this.i, data.length-1)

            iSave -= ( iSave > 0 ? 1 : 0)
            ctx.moveTo(data[iSave].x , data[iSave].y)
            ctx.lineTo(Xmid + a1, Ymid + a2 );
        })
    }

    
    /** main */
    async #main(func) {
        for (let x = 0; x < this.loopLength; x += 1) {

            clear()
            if((this.flowMid > this.horizon || this.flowMid < -this.horizon)) {
                this.adder *= -1
            }
            this.flowMid += this.adder

            for (let gi = 0; gi < this.amount; gi += 1) {

                for (let i = 0; i < this.linesAmount; i += 1) {
                     ctx.beginPath();


                    if(this.gradient && !this.grayscale){
                        if(i % this.colorModulus == 0) {
                            if(this.movingGradient && x % this.gradientSpeed == 0) {
                                this.currentGradient += 1
                            }
                            ctx.strokeStyle = `hsla(${(overcount((i /  this.colorModulus) + this.currentGradient, this.gradientReachMax)).toFixed(0)},${this.saturation}%,50%,${this.transparency})`;
                        }
                    } else if(this.grayscale) {
                        ctx.strokeStyle = `hsla(0,0%,50%,${this.transparency})`;
                    }
                    this.i = i
                    this.gi = gi
                    this.x = x
                    // fack "this"
                    this.a = i  - this.flowMid + randint(this.noiseX);
                    this.b =          this.startPointY      - gi * this.space - Math.cos((i + (x  * this.direction) - gi * this.cursive) * (Math.PI / this.freq )) * this.amp + randint(this.noiseY);
                    this.randomness = this.startPointY - 10 - gi * this.space - Math.sin((i - (x  * this.direction) - gi * this.cursive) * (Math.PI / this.freq )) * this.amp + randint(this.noiseY);
    
                    func()
                    ctx.stroke()

                }
            }
            if(exit) {
                throw "exit";
            }
            await sleep(this.speed)
            //await sleep(1)
            await pauseHalt()

        }
        return true
    }




}