/**
 * a Stickman Walking game
 */

/** environmental config */
const Engin = Object.freeze({
    // the force which pulls object down
    gravity: 0.8,
    // what slows down movement, ?inversely proportional?
    friction: 0.93,
})

/** game content config */
class GameLevel  {
    constructor() {
        this.foreground = new Map()
        this.background = new Map()
        this.startpos = Object.freeze({
            x: Xmid,
            y: 800
        }),
        this.seaLevel = 800
        this.x = this.startpos.x
        this.y = this.startpos.y
        this.z = 0
        this.zoff = 0.1
        this.df = 2000
        this.xVelocity = 0
        this.yVelocity = 0
        this.xAcceleration = 0
        this.yAcceleration = 0
        this.elasticity = 0.45
        this.mass = 8
        this.jumpingPower = 8
        this.speedX = 1
        this.speedY = 1.7
        this.boudingdBox = true
        this.currentPlatform = this.seaLevel

        this.updatePhysics = applyPhysics.bind(this)
    }
    update(direction = null) {
        if(direction) this.direction = direction
        switch(direction) {
            case 'up':
                if (floor(this.yAcceleration)===0 && floor(this.yVelocity)===0) {
                    this.yAcceleration = this.jumpingPower * this.speedY
                } 
                break;
            case 'left':
                this.xVelocity -= this.speedX;                
             
                break;
            case 'right':
                this.xVelocity += this.speedX;                
                break;
        }
        this.updatePhysics()
    }
    getLightSource() {
        return {
            x: Xmax-250 - this.x, 
            y: this.seaLevel - this.y,
            z: 1,
            radius: 1500,
        }
    }
    createBlock(x, y, w=200, h=10) {
        this.foreground.set('block_'+this.foreground.size, new Platform(x, y, w, h))
    }
    renderBackground() {
        rect(0, 0, Xmax, Ymax, null,  '#000')

        this.background.forEach(i=>i.show())
        setLightSpot({...this.getLightSource(), cl: '#f44', varLight: 2})

    }
    renderForeground() {
        this.foreground.forEach(i=>{
            getLightingShade(i, this.getLightSource())
            i.show()
        })
        shade("green", 0, 0, 0)
        this.foreground.forEach(i=>i.show())

        // ground
        const disLight = getLightingShade(this, this.getLightSource())
        const cl = disLight > 50 ? 50 : floor(disLight>10?disLight:10)
        const grd = ctx.createLinearGradient(0, disLight, 0, Ymax+300);
        grd.addColorStop(0, hsl(0, 40, cl));
        grd.addColorStop(1, "#000");
        shade("green", 0, 0, 0)



        font(20)
        ctx.fillStyle = "red"
        ctx.fillText(str("PLAYER"), Player.x, Player.y)
        ctx.fillStyle = "blue"
        ctx.fillText(str("Game"), Game.x, Game.y)


        ctx.fillText(str(toFixed(this.x)), 20, 20)
        ctx.fillText(str(toFixed(this.y)), 120, 20)
        line(0, this.currentPlatform, Xmax, this.currentPlatform, "red")

        //rect(0, this.seaLevel - this.y, Xmax, Ymax - this.y + this.seaLevel, null, grd)
    }
}

// player
let Player = null
const Game = new GameLevel()



/**  applying physics to an element */
function applyPhysics() {
    const {x:px, y:py} = Player
    // if player is above platform
    for(const [k, v] of Game.foreground.entries()) {
        if(floor(this.y) <= floor(v.y) && this.x >= v.x && this.x < v.x+v.w) { // && floor(this.y) != this.currentPlatform 
            log(v.y)
            this.currentPlatform = v.y
        }
    }


    // smooth de/acceleration of y velocity
    if(this.yAcceleration>0) {
        if(this.yAcceleration<2) this.yAcceleration = 0
        this.yAcceleration *= Engin.friction //* Engin.gravity
        if(this.yAcceleration<0.1) this.yAcceleration = 0
        else this.yVelocity -= this.yAcceleration
    }
    
    // Y  under the ground, bounce 
    if(this.y > this.currentPlatform) {
        this.y = this.currentPlatform
        this.yAcceleration = 0
        this.yVelocity *= this.elasticity
        // bounce
        if(posInt(this.yVelocity) >0.1)  {
            this.yAcceleration = (this.yVelocity) * Engin.friction * this.elasticity 
            this.yVelocity = 0
        }
    } 
    // Y in air, apply gravity
    else if (this.y < this.currentPlatform) {
        this.yVelocity += this.mass*Engin.gravity
    } 
    
    // safe shizzle
    if(posInt(this.xVelocity)<0.01 && posInt(this.xVelocity) >0) this.xVelocity = 0
    if((this.yVelocity<0.01 && this.yVelocity >0) || (this.yVelocity>-0.01 && this.yVelocity <0)) {
        this.yVelocity = 0
    }
    
    // friction
    this.xVelocity *= Engin.friction
    this.yVelocity *= Engin.friction
    
    this.y += this.yVelocity 
    this.x += this.xVelocity 
   
    // apply forces, depending on preference, go true walls or not
    if(!this.boudingdBox) {

        if(this.x>Xmax) this.x = Xmin
        else if(this.x<Xmin) this.x = Xmax
    }
}

/** sets ctx shadow from corrent angle */
function getLightingShade(targ, src) {
    if(!(targ instanceof Stickman)) return 0
    if(!targ.z) targ.z=  1    
    if(!src.z) src.z=  1    
    const z  = (targ.z + src.z)/2
    const dis = distanceTo(targ, src)/10
    const pos = posTowards(targ, src, dis)
    const blurr = dis/5*z
    const dir = !(1/pos.a >= -Infinity)

    // textCenter(pos.a)

    ctx.shadowColor = '#0008'
    ctx.shadowOffsetX = dir ? -pos.x : pos.x
    ctx.shadowOffsetY = dir ? -pos.y : pos.y
    ctx.shadowBlur = blurr<2 ? 2 : blurr
    return dis
}

function isOutOfSigth(src) {
    if(src.x > Xmax || src.x < Xmin || src.y > Ymax || src.y<Ymin) return true
}

/**  stickmna/player class */
class Stickman {
    constructor() {
        this.posX = Game.startpos.x
        this.posY = Game.startpos.y - 0
        this.x = this.posX //- Game.x
        this.y = this.posY //- Game.y - Game.seaLevel
        this.z = 1
        this.direction = ''
        this.cl = "#f00"
        this.legs = {
            spread: 30 * this.z,
            speed: 0.05 * this.z,
            height: 50 * this.z,
            shoePos: 2 * this.z,
            shoeSize: 8 * this.z
        }
        this.arms = {
            spread: 20 * this.z,
            speed: 0.05 * this.z,
            height: 40 * this.z,
            pos: 30 * this.z,
        }
        this.headSize = 20 * this.z
        this.puppetMasterY = Ymin-1000
    }
    show() {
        const { z, arms, legs, headSize, x} = this
        const acc = (1+(Game.yAcceleration/10))
        const y = this.y - 50

        // legs, top
        const legy = y + legs.height
        const leg1x = x + sin(Game.x * legs.speed) * legs.spread * acc
        const leg2x = x - sin(Game.x * legs.speed) * legs.spread * acc
        const shoe = Game.direction==='left' ? -legs.shoeSize : legs.shoeSize

        // arms
        const army = legy - arms.height
        const arm1x = x + sin(Game.x * arms.speed) * arms.spread * acc
        const arm2x = x - sin(Game.x * arms.speed) * arms.spread * acc
        // head
        const bodyHeight = 50 * z + sin(x * legs.speed * 2) * 2

        // have to run in 2 loops otherwise shadow will go infront of objets
        const lineToDraw = [
            [x, y-arms.pos, arm2x, army], //arm back
            [x, y, leg2x, legy], // leg back
            [leg2x-legs.shoePos, legy-legs.shoePos, leg2x+shoe, legy-2], // shoe back
            [x, y-bodyHeight, x, y], // body
            [x, y, leg1x, legy], // leg front
            [leg1x-legs.shoePos, legy-legs.shoePos, leg1x+shoe, legy-2], // shoe front
            [x, y-arms.pos, arm1x, army], // arm front
        ];
        const dis = getLightingShade(this, Game.getLightSource())
        const cl = hsl(0, 100-dis/20, 100-dis/20)

        ctx.lineWidth = 2
        // puppet master lines
        lineToDraw.forEach((i)=> {
            line(x, this.puppetMasterY, i[2], i[3], hsl(0, 10, 10, 0.1))
        })

        // body shadow
        ctx.lineWidth = 6 * (z)
        lineToDraw.forEach((i)=> {
            line(i[0], i[1], i[2], i[3], "#000")
        })
        point(x, (y-bodyHeight), headSize, "#000")

        // actual body
        ctx.shadowColor='rgba(0,0,0,0)';
        shade()
        lineToDraw.forEach((i)=> {
            line(i[0], i[1], i[2], i[3], cl)
        })
        point(x, (y-bodyHeight), headSize, cl)
    }
}

class PerlinLine {
    constructor() {
        this.x = 0.1
        this.y = Game.seaLevel - 300
        this.zoff = randint(1000)
    }
    show() {
       // this.y+= 1
       // this.y = overcount(this.y, Game.seaLevel)
        let x = Game.x
        let lx  =x
        let y= this.y- Game.y
        let ly = y
        while(x<Xmax) {
            const value = noise.perlin3(x/Game.df, y/Game.df,  Game.zoff +this.zoff)
            const angle = ((1 + value) * 1.1 * 128) / (PI2)
            const p = rotateVector(x, y, angle)

            line(lx, ly, x+p.x, y+p.y, "#00F9")
            lx = x
            ly = y
            x += posInt(p.x)
            y -= p.y/10
        }

    }
}

/** background triangles */
class FloatingShape {
    constructor(id) {
        this.id = id
        this.x = randint(Xmax)
        this.y = randint(Ymin, Game.seaLevel)
        this.z = randfloat()
        this.size = (randfloat()+1)*100
        this.cl = hsl(randfloat()*36,30, 20)
        this.rotation = randint(360)
        this.rotSpeed = (2-(1 * this.size/100))/1.2
        if(this.rotSpeed<0.3) this.rotSpeed += 1
        this.falling = false
        this.mountain = false
        this.speed = {
            x: 0, // randfloat(-1, 1),
            y: 0 // randfloat(-1, 1)
        }
    }
    show() {
        if(isOutOfSigth(this)) return
        getLightingShade(this, Game.getLightSource())
        if(!this.mountain) {
            if(this.falling) {
                if(this.y<Game.seaLevel) this.y += this.speed.y
                else this.mountain = true
            }
    
            if(floor(this.rotation) >= 360 && !this.falling) {    
                this.speed.y = 2
                this.falling = true
            } else if(!this.falling) this.rotation += this.rotSpeed
        }
        const y = this.y - 50 - Game.y + Game.seaLevel
        const x = this.x - Game.x
        const z = this.z - Game.z

        const value = noise.perlin3(x/Game.df, y/Game.df,  z)
        const angle = ((1 + value) * 1.1 * 128) / (PI2)
        const v = rotateVector(x, y, angle)

        triangle(x+v.x, y+v.y, this.size, this.cl, {rotate: overcount(this.rotation, 360)})
        if(x> Xmax || x < Xmin) this.speed.x *= -1
        if(y > Game.seaLevel || y < Ymin) this.speed.y *= -1
        ctx.shadowColor='rgba(0,0,0,0)';
    }

}

/** platform */
class Platform {
    constructor(x, y, w, h) {
        this.posX = x
        this.posY = y
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.z = 1
        this.cl = "#222"
    }
    show() {
        this.x = this.posX - Game.x
        this.y = this.posY - Game.y  + Game.seaLevel

        rect(this.x, this.y, this.x+this.w, this.y+this.h, null, this.cl)
    }
}




async function animate() {
    clear()
    Game.update()
    /** INSERT: background */
    Game.renderBackground()

    /** INSERT: foreground */
    Game.renderForeground()
    Player.show()

    /** -----------------  */
    await pauseHalt()
    if (!exit) requestAnimationFrame(animate)
}

const init = async () => {
    Player = new Stickman()
    // Game.background.set('line', new PerlinLine())
    // Game.background.set('line2', new PerlinLine())
    range(10).forEach((i, idx)=> Game.background.set('square_'+idx, new FloatingShape('square_'+idx)) )
    // Game.background.set('line3', new PerlinLine())
    //Game.background.set('line4', new PerlinLine())


    Game.createBlock(Xmid-400, Game.seaLevel-100)
    Game.createBlock(Xmid-220, Game.seaLevel-190)
    Game.createBlock(Xmid, Game.seaLevel-290)


    Events.setKeys([
        ["ArrowRight", () => Game.update('right')],
        ["ArrowLeft", () => Game.update('left')],
        ["ArrowUp", () => Game.update('up')],
        ["ArrowDown", () => Game.update('down')],
    ], 'player_1')

    Events.setKey("r", () => window.location.reload())
    animate()
}
init()