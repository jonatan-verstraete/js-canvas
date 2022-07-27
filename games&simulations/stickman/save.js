/**  applying physics to an element */
function applyPhysics_SAVE() {
    let currentPlatform = Game.seaLevel
    const {x:px, y:py, z:pz} = Player

    // if is above platform
    for(const [k, v] of Game.foreground.entries()) {
        //if(inRange(this.x, v.x, 10)) log("inRange", px, this.x, v.x)
        if(floor(this.y) >= floor(v.y) && floor(this.y) != currentPlatform && this.x >= v.x && this.x < v.x+v.w) {
            currentPlatform = v.y
        }
    }


    // for(const [k, v] of Game.foreground.entries()) {
    //     if(floor(py) >= floor(v.y) && floor(py) != currentPlatform && px >= v.x && px < v.x+v.w) {
    //         currentPlatform = v.y
    //     }
    // }

    // smooth de/acceleration of y velocity
    if(this.yAcceleration>0) {
        if(this.yAcceleration<2) this.yAcceleration = 0
        this.yAcceleration *= Engin.friction //* Engin.gravity
        if(this.yAcceleration<0.1) this.yAcceleration = 0
        else this.yVelocity -= this.yAcceleration
    }
    
    // Y  under the ground, bounce 
    if(this.y > currentPlatform) {
        this.y = currentPlatform
        this.yAcceleration = 0
        this.yVelocity *= this.elasticity
        // bounce
        if(posInt(this.yVelocity) >0.1)  {
            this.yAcceleration = (this.yVelocity) * Engin.friction * this.elasticity 
            this.yVelocity = 0
        }
    } 
    // Y in air, apply gravity
    else if (this.y<currentPlatform) {
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
    
   
    // apply forces, depending on preference, go true walls or not
    if(!this.boudingdBox) {
        this.y += this.yVelocity 
        this.x += this.xVelocity 

        if(this.x>Xmax) this.x = Xmin
        else if(this.x<Xmin) this.x = Xmax
    } else {
        this.x += this.xVelocity 
        this.y += this.y > this.y ? 0 : this.yVelocity
    }

}



// Object.prototype.project = function() {
//     const projScale = 1
//     this.projX = (this.posX * projScale) - Game.x
//     this.projY = (this.posY * projScale) - Game.y - Game.seaLevel
// }