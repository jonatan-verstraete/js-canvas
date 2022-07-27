let foods = []

class Food {
    constructor(x, y, size) {
        this.x = x || randint(Xmax)
        this.y = y || randint(Ymax)
        this.size = size || randint(5, 20)

        this.color = "green"
    }
    show() {
        if (this.size <= 0) {
            log('food empty')
            return foods.splice(foods.indexOf(this), 1)
        }
        circle(this.x, this.y, this.size, null, this.color)
    }
}

class Colony {
    constructor(x, y, col) {
        this.base = {
            x: x,
            y: y
        }
        this.flag = col ? col : COLORS.random()
        this.ants = range(10).map(i => new Ant(this.base.x, this.base.y, this))
        this.food = 0
        this.size = 20
    }
    show() {
        circle(this.base.x, this.base.y, this.size, null, this.flag)
        for (let ant of this.ants) {
            ant.move()
        }
    }
    update(amt) {
        this.food+= amt
        this.size = 20 + (this.food/10)
    }
}

class Ant {
    constructor(x, y, colony) {
        this.home = colony
        this.x = x
        this.y = y
        this.size = 10

        this.speed = {
            x: randfloat(-2, 2),
            y: randfloat(-2, 2)
        }

        this.target = null
        this.lastTarget = null

        this.lineOfSignt = 20
        this.load = 0
        this.strength = 1
    }
    checkFood() {
        if (this.target || this.load) return

        for (let foody of foods) {
            const d = distanceTo(this, foody)
            if (d <= this.lineOfSignt) {
                if (d == 0) {
                    log('FOODY IN SIGHG')
                    foody.size -= this.strength
                    this.load = this.strength
                    this.target = this.home
                } else {
                    this.target = foody
                }
                return
            }
        }
    }
    move() {
        // reached border
        if (this.x > Xmax) this.speed.x *= -1
        if (this.y > Ymax) this.speed.y *= -1
        if (this.x < Xmin) this.speed.x *= -1
        if (this.y < Ymin) this.speed.y *= -1

        this.checkFood()
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
            this.x += this.speed.x
            this.y += this.speed.y
        }


        // show
        markPoint(this.x, this.y, this.size, {
            stroke: this.load? "red": this.flag,
            txt: this.home.ants.indexOf(this)
        })
    }
}

const colony1 = new Colony(300, 300)
foods.push(new Food(500, 500))

function main() {

    async function animate() {
        clear()
        for(let foody of foods) foody.show()

        colony1.show()
        await pauseHalt()
        requestAnimationFrame(animate)

    }
    animate()
}
main()