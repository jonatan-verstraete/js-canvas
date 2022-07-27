const gp = 10
let mousePos = {}
let angle = null
const canonBalls = []

class Tank {
    constructor(x, y) {
        this.x = x;
        this.y = y
        this.size = 50
        this.topX = x-20
        this.topY = y-95
        this.angle = 0
        this.color = 'green'
        this.speed = 10
        this.availableShots = 5

        window.projectileLoader = setInterval(()=> {
            if(this.availableShots <5) this.availableShots += 1
        }, 1000)
    }
    draw() {
        if(!mousePos) return
        this.rotate()
        const {x, y, size:s, topX:tx, topY:ty, angle:ang} = this
        ctx.lineWidth = s/2
        // canon
        line(x, y, tx, ty, this.color)
        //rect(x+ang.x-s/2, y+ang.y,x+ang.x+s/2, y+ang.y-s/2, null, this.color)
        ctx.lineWidth =  s/4
        //body
        rectRounded(x-s*2, y+s, x+s*2, y+s*1.5, this.color)
        rect(x+s*2, y+s, x-s*2, y, null, this.color)
        point(x, y, 80, this.color)
    }
    rotate(){
        this.angle = rotateVector(this.x, this.y, 1-(atan2(mousePos.y-this.y, mousePos.x-this.x)), 10);
        this.topX = this.x+this.angle.x-this.size/2
        this.topY = this.y+this.angle.y-this.size/2

    }
    moveDir(direction) {
        //if(touchBoundary(this.x, this.y, this.size+this.speed, 0)) return
        if(this.x+(this.size+this.speed)  >= Xmax-this.speed) return
        if(this.x-(this.size+this.speed)  <= Xmin+this.speed) return

        switch(direction) {
            case 'left':
                this.x -= 10
                break;
            case 'right':
                this.x += this.speed 
                break;
        }
    }
    fireProjectile() {
        if(this.availableShots<=0) return
        const angle = 1-this.angle.angle
        if(angle < -2 || angle > 0.5) return
        const dis= distanceTo(this, mousePos)
        canonBalls.push( new Projectile(this.topX, this.topY, angle+(randfloat()/10), dis/50))
        this.availableShots-=1
    }
}

class Projectile  {
    constructor(x, y, angle, force=15) {
        this.radius = 40
        this.mass = this.radius
        this.angle = angle
        this.gravity = 0.09 * (force/7)
        this.elasticity = 0.5
        this.deceleration = 0.05
        this.friction = 0.008

        this.x = x
        this.y = y
        this.dx = cos(this.angle)*force
        this.dy = sin(this.angle)*force

        this.color = "#111"//hsl(canonBalls.length*2)
    }
    showMovement() {
        if(this.y + this.gravity < Ymax-this.radius) {
            this.dy += this.gravity
        }
        this.dx -= this.dx*this.friction
        this.x += this.dx
        this.y += this.dy

        const outXmax = this.x >= Xmax-this.radius
        const outXmin = this.x <= Xmin+this.radius
        const outYmax = this.y >= Ymax-this.radius
        const outYmin = this.y <= Ymin+this.radius

        if(outXmax||outXmin||outYmax||outYmin) {
            this.dy *= this.elasticity

            if(outXmax) {
                this.x -= this.radius
                this.dx *=-1
            } else if(outXmin) {
                this.x += this.radius
                this.dx *=-1
            } else if(outYmax) {
                //this.y-= this.radius
                this.dy *=-1
            }else if(outYmin) {
                this.y += this.radius
                this.dy *=-1
            }
        }
        point(this.x, this.y, this.radius, this.color)
    }
}

const figure = new Tank(100, Ymax-100)

const animate = async() =>{
    clear()
    figure.draw()
    canonBalls.forEach((prjA, idxA, arr)=> {
        prjA.showMovement()
        //check for collisions between balls
        arr.forEach((prjB, idxB)=> {
            if(idxA === idxB) return

            const inreach = closeTo(prjA, prjB, prjA.radius)
            if(inreach) {
                const dis = sqrt(inreach.x**2+inreach.y**2)
                // the normalized collision verctor direction
                const collisionNorm = {x:inreach.x/dis, y:inreach.y/dis}
                // relative velocity of ball 'b'
                const relativeVelocity = {x: prjA.dx - prjB.dx, y: prjA.dy - prjB.dy };
                // calcualte the dot product
                const speed = ((relativeVelocity.x * collisionNorm.x) + (relativeVelocity.y + collisionNorm.y))/2;
                // do nothing if object aren't moving towards each other
                if(speed<0) return
                // prjA.dx *=-1
                // prjB.dx *=-1
                // prjA.dy *=-1
                // prjB.dy *=-1
                let impulse =  (1*speed / (prjA.mass + prjB.mass))
                // move objects in opposite direction of each other
                prjA.dx += (impulse * prjB.mass * collisionNorm.x)
                prjA.dy += (impulse * prjB.mass * collisionNorm.y)
                prjB.dx += (impulse * prjA.mass * collisionNorm.x)
                prjB.dy += (impulse * prjA.mass * collisionNorm.y)
                // elasticity
                prjA.dy *= prjA.elasticity
                prjB.dy *= prjB.elasticity
            }
        })

    })
    markPoint(mousePos.x, mousePos.y, 50)
    await pauseHalt()
    requestAnimationFrame(animate)
}

const init = ()=> {
    Events.setKey('ArrowRight', ()=>figure.moveDir('right'))
    Events.setKey('ArrowLeft', ()=>figure.moveDir('left'))
    cnv.addEventListener('mousemove',e=> {
        mousePos = {
            x: e.clientX - cnv.offsetLeft,
            y: e.clientY - cnv.offsetTop
        }
    })
    cnv.addEventListener('click',e=> {
        figure.fireProjectile()
    })

    animate()
}

init()