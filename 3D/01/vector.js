class Vectorz {
    constructor(x, y, z) {
        this[0] = x
        this[1] = y
        this[2] = z
    }
    cross(targ) {
        return new Vector(
            this[1]*targ[2] - this[2]* targ[1], // x
            this[0]*targ[2] - this[2]* targ[0], // y
            this[0]*targ[1] - this[1]* targ[0], // z
        )
    }
    add(targ) {
        return new Vector(
            this[0]+targ[0],
            this[1]+targ[1],
            this[2]+targ[2],
        )

    }
    substract(targ) {
        return this.add(targ.scale(-1))
    }
    scale(scalar) {
        return new Vector(
            this[0]*scalar,
            this[1]*scalar,
            this[2]*scalar,
        )
    }

    rotateY(theta_n) {
        let [x, y, z] = this
        return new Vector(
            Math.cos(theta_n) * x - Math.sin(theta_n) * z,
            y,
            Math.sin(theta_n) * x + Math.cos(theta_n) * z
    
        )
    }
    
    rotateX(theta_n) {
        let [x, y, z] = this
        return new Vector(
            x,
            Math.cos(theta_n) * y - Math.sin(theta_n) * z,
            Math.sin(theta_n) * y + Math.cos(theta_n) * z
        )
    }
}