
const drops = []

class Drop {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.speed = randfloat(0.3, 0.8)
        this.size = randint(10, 50)
        this.color=COLORS.next()
        this.points = range(this.size).map(i => {
            const { x, y } = posByAngle(this.x, this.y, degRad(randint(360)), randint(10, 150))
            return {
                x: this.x,
                y: this.y,
                isReached: false,
                dis: 1,
                targ: {
                    x:x,
                    y:y,
                    dis: distanceTo(this, {x:x, y:y}, true)
                },
            }
        })
    }
    draw() {
        if(!this.points.length) return drops.splice(drops.indexOf(this), 1)
        for(let i of this.points) {
            const targDis = distanceTo(i, i.targ, true)
            if(targDis<this.speed*3) return this.points.splice(this.points.indexOf(i), 1)

            const {x, y} = posTowards(i, i.targ, this.speed)
            i.x += x
            i.y += y

            i.dis += 0.08
            point(i.x, i.y, (targDis/10)*this.speed, this.color)
        }
    }
}


window.addEventListener('click', function(e) {
    const {x, y}= getMouse(e)
    drops.push(new Drop(x, y))
})