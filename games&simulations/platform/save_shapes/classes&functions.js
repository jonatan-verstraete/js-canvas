

const Game={
    floor: 200,
    x:0,
    y:0,
    orientation_x: 1,
}

/**
 * 
 * Object, classes, payer/figures
 */

/** class player */
class Snowman {
    constructor(x=0, y=0){
        this.x = x
        this.y = y
        this.movement=0
        this.size = 100
        this.speed=10
        this.orientation_x=1

        this.fill = [120,200,250]
        
        this.body_parts = [
            Object.assign(new BodyPart("bottom"), this),
            Object.assign(new BodyPart("body"), this),
            Object.assign(new BodyPart("head"), this),
        ]
    }
    move_left(){
        Game.x -= this.speed;
        Game.orientation_x=1
    }
    move_right(){
        Game.x += this.speed;
        Game.orientation_x=-1
    }
    show() {
        noStroke()
        ambientMaterial(...this.fill)
        for(let i of this.body_parts) i.display()
    }
}

/** class body part */

class BodyPart {
    constructor(type) {
        this.type=type
        switch(type) {
            case "bottom":
                this.r = 1
                this.h = 0.5
                this.angle = 0
                this.angle_max = 0.1
                this.angle_change = get_angle_change(this.angle_max)
                this.directionInfluence = 0
                this.pv_y = 10
                this.pv_x = 10
            break;
            case "body":
                this.r = 0.7
                this.h = 1
                this.angle = 0
                this.angle_max = 0.5
                this.angle_change = get_angle_change(this.angle_max)
                this.directionInfluence = 10
                this.pv_y = 10
                this.pv_x = 10
                break;
            case "head":
                this.r = 0.5
                this.h = 1.4
                this.angle = 0
                this.angle_max = 0.30
                this.angle_change = get_angle_change(this.angle_max)
                this.directionInfluence = -20
                this.pv_y = 10
                this.pv_x = 10
                this.sub_parts= ()=> {

                }
                break;
                
            default:
                noLoop()
                alert('Body part'+type+"not found")
        }
    }
    display(){
        push()
        const rad = this.size
        const sx = 0
        const sy = Game.floor-(this.size*this.h)

        translate(sx, sy)
        rotate(this.angle)
        translate(-this.pv_x, -this.pv_y)
        translate(this.directionInfluence*Game.orientation_x, 0)



        this.angle += this.angle_change
        if (abs(this.angle) > this.angle_max)
            this.angle_change *= -1


        pointLight(250, 250, 250, sx+rad/2, sy-rad/2, rad/1.5)
        ellipse(0, 0, rad*this.r*1.05, rad*this.r)
        pop()
    }
}

/** class figure */
class Figure {
    constructor(x, y, w, cl) {
        this.x=x
        this.y=y
        this.width=w
        this.color=cl
    }
    display() {
        fill(this.color)
        const x = this.x+Game.x
        const y = this.y+Game.y

        rect(x, y, this.width, this.width)
    }
}



/** 
 * 
 * Helpers 
 * */
function get_angle_change(max_ang, size=25) {
    return max_ang/size
}