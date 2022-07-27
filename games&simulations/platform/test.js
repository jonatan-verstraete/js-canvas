function setup() {
    createCanvas(300, 300);
}

// (-5, 15) measured form the center of the rectangle
let pivot_x = -15, pivot_y = 15;    

// Position at which the pivot point should be moved in the world
let target_x = 150, target_y = 100; 

let angle = 0;
let angle_change = 0.01;

function draw() {
    background(255);
    
    push()

    translate(target_x, target_y);
    rotate(angle);
    translate(-pivot_x, -pivot_y);

    noFill();
    stroke(0)
    rectMode(CENTER)
    rect(0,0,100,30);

    pop();
    
    noStroke();
    fill(255, 0, 0);
    circle(target_x, target_y, 5)
    
    angle += angle_change;
    if (abs(angle) > 0.5)
        angle_change *= -1;
}