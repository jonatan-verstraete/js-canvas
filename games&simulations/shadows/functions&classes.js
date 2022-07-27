let mouseX=0, mouseY=0;

function getquarePoints(x, y, s) {
    const p1 = {x:x  , y:y  }
    const p2 = {x:x+s, y:y  }
    const p3 = {x:x+s, y:y+s}
    const p4 = {x:x  , y:y+s}
    return [p1, p2, p3, p4]
}

function movePoints(points, x, y) {
    return points.map(i=> {
        return {x:i.x+x, y:i.y+y }
    })
}

class Shape {
    constructor(points) {
        this.points = points
        this.origianlPoints = copy(points)
        this.speed=randfloat(0.1,1)
    }
    move(){
        if(pause)return
        if(this.points.every(i=>i.y>Ymax)|| this.points.every(i=>i.x>Xmax) ) return this.reset()
        this.points = movePoints(this.points, this.speed, this.speed)
    }
    reset() {
        this.points = movePoints(this.origianlPoints, 0, -100)
    }
}



document.addEventListener('mousemove', (event) => {
    const c = cnv.getBoundingClientRect();
    mouseX = event.clientX - c.left
    mouseY = event.clientY - c.top
});