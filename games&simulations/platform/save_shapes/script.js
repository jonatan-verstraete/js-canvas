

let player;
const terrain = []

function setup() {
    createCanvas(900, 600, WEBGL);
    noStroke()
    background(230, 240, 255)
    player = new Snowman()
    terrain.push(new Figure(20, 20, 40, "green"))
}




function draw() {
    //noLoop()
    background(230, 240, 255)
    //logic
    controls()
    //view
    pointLight(200, 200, 250, width, height, 2900)
    player.show()
    terrain.forEach(i=>i.display())

    ellipse(0, 0, 10, 10);
    stroke(111,0,0)
    line(-width/2,0,width/2,0)
    stroke(111)
    line(-width/2,Game.floor,width/2,Game.floor)
}



function controls(){
    if (keyIsDown(LEFT_ARROW)) player.move_left()
    if (keyIsDown(RIGHT_ARROW)) player.move_right()

    
    //   if (keyIsDown(UP_ARROW)) {
    //     y -= 5;
    //   }
    
    //   if (keyIsDown(DOWN_ARROW)) {
    //     y += 5;
    //   }
}