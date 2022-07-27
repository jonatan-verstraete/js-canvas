
const game =  {
    speed: 5,
    playerSpeed: 15,
    x: 0,
}
let walls,
player
score=0;

class Player {
    constructor() {
        this.x = 90
        this.y = Ymid
        this.size = 50
    }
    show() {
        rect(this.x, this.y, this.x-this.size, this.y-this.size, null, "red")
    }
}

class Obstacle {
    constructor(x=0) {
        this.width = 50
        this.holeHeight = randint(60,100)
        this.holePos = Ymid-randint(200)
        this.x = Xmax - this.width - x

    }
    move() {
        if(this.x+this.width < Xmin) {
            walls.pop()
            walls.unshift(new Obstacle())
            return
        }
        this.x -= game.speed
        rect(this.x, 0, this.x+this.width, this.holePos-this.holeHeight, null, "black")
        rect(this.x, Ymax, this.x+this.width, this.holePos+this.holeHeight, null, "black")
    }
}
function lost() {
    Events.setKey("r", () => {
        window.location.reload()
    })
    log('DONE')
    ctx.font = "90px Arial";
    textCenter('YOU LOSE, press r')
}

function check() {
    const {x:px, y:py} = player
    for(let i of walls) {
        // dead
        if(px>= i.x && ( (py<=i.holePos-i.holeHeight)||(py>=i.holePos+i.holeHeight) )){
            lost()
            return false
        }
        if(px === i.x+i.width && py>i.holePos-i.holeHeight && py<i.holePos+i.holeHeight) score++
    }
    return true
}


function main() {   
    walls = range(3).map((i, idx)=>new Obstacle(idx*500))
    player = new Player()

    Events.setKey("ArrowUp", () => {
        player.y -= game.playerSpeed
    })
    Events.setKey("ArrowDown", () => {
        player.y += game.playerSpeed
    })

    ctx.font = "30px Arial";
    async function animate() {
        clear()
        ctx.fillText(str(score), Xmax-20, 20)
        walls.forEach((i)=>i.move())
        player.show()
        await pauseHalt()
        if(check()) requestAnimationFrame(animate)
        
    }
    animate()

    
}

main()