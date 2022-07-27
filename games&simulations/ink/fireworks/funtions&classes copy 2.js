
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
                isReached: 0,
                targ: {
                    x:x,
                    y:y
                },
            }
        })
    }
    draw() {
        if(!this.points.length) return drops.splice(drops.indexOf(this), 1)
        for(let i of this.points) {
            if(!i.isReached) {
                if(distanceTo(i, i.targ, true)<this.speed*3) i.isReached=1
                const {x, y} = posTowards(i, i.targ, this.speed)
                i.x += x
                i.y += y
            } else {
                i.isReached += 0.3
                if(i.isReached>30) return this.points.splice(this.points.indexOf(i), 1)
            }
            point(i.x, i.y, this.size/i.isReached, this.color)
        }
    }
}


window.addEventListener('click', function(e) {
    const {x, y}= getMouse(e)
    drops.push(new Drop(x, y))
})