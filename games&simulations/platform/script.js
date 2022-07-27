
let player;
let spritesheet, spritedata;
const animation = []
let flipped = false;


function preload() {
    spritedata = loadJSON('../../assets/spritesheets/horse_color.json')
    spritesheet = loadImage('../../assets/spritesheets/horse_color.png')
}

function setup() {
    createCanvas(900, 600);
    noStroke()
    background(230, 240, 255)
    let frames=spritedata.frames
    for(let i=0; i<frames.length;i++){
        const {x, y, w, h} = frames[i].position
        animation.push(spritesheet.get(x, y, w, h))
    }
    frameRate(10)
}


let framecount = 0

function draw() {
    controls()
    background(230, 240, 255)

    const img = animation[(framecount%animation.length)]
    
    // if(flipped)  {
    //     push()
    //     scale(-1, 1)
    //     if(flipped)image(img, -200, 200, 100, 100)
    //     pop()
    // }else {
    //     image(img, 200, 200, 100, 100)
    // }
    push()
    if(flipped) {
        scale(-1, 1)
        translate(-img.width/2, 0)
    }
    image(img, 200*(flipped?-1:1), 200, 100, 100)
    pop()
        

    framecount++
}



function controls(){
    if (keyIsDown(LEFT_ARROW)) 
        flipped = true
    if (keyIsDown(RIGHT_ARROW)) 
        flipped = false
}