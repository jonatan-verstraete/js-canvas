let tx, ty, tz, gap, rows, cols, depths;
let w3D, h3D, d3D;

let video;
let cubeSize;
let prevpixels;


class Cube{
    constructor(r,g,b){
        this.height = (r+g+b)/3

        this.acceleration = 0
        this.fraction = 0.999
        this.riseSpeed = 1
        this.reset = 0
    }
    level(r, g, b){

        if(this.acceleration <= 0.1)  this.acceleration = 0
        else this.acceleration *= this.fraction

        if(this.reset > 1000 || this.height<0) {
            this.reset = 0
            this.height = (r+g+b)/3
            this.acceleration = 1
        } else {
            this.reset++
            this.height -= this.acceleration/10
        }
        return floor(this.height/10)
    }
}
const cubes=[]



function init(){
    video.loadPixels();
    for (let j = 0; j < video.height; j+=pixelinc) {
      for (let i = 0; i < video.width; i+=pixelinc) {
        const pxidx = (i + j * video.width) * 4;
        const r = video.pixels[pxidx+0];
        const g = video.pixels[pxidx+1];
        const b = video.pixels[pxidx+2];
        cubes.push(new Cube(r, g, b))
      }
    }
}


function setup() {
    //frameRate(10)
    video = createCapture(VIDEO);
    video.size(128, 96);
    //video.hide()

    createCanvas(windowWidth, windowHeight, WEBGL);
    camera();
    noStroke();
    ortho();

    gap = 0;
    theta = 10;
    scale = 10
    pixelinc = 5
    init()
}




function draw() {
    if (pause) return
    background(255)
    orbitControl();

    directionalLight(250, 150, 0, 200, 200, 0);
    //directionalLight(0, 150, 250, -200, -200, 0);
    //camera(0, 0, 2800, 0, 0, 0, 0, 1, 0);
    ambientLight(220, 180, 180)

    rotateX(180)
    rotateY(50)
    rotateZ(theta)



    video.loadPixels();
    for (let j = 0; j < video.height; j+=pixelinc) {
      for (let i = 0; i < video.width; i+=pixelinc) {
        push()
        translate(video.width*scale-(i*scale)+gap, j*scale+gap, 0);

        const pxidx = (i + j * video.width) * 4;
        const r = video.pixels[pxidx+0];
        const g = video.pixels[pxidx+1];
        const b = video.pixels[pxidx+2];
        ambientMaterial(r,g,b);

        for(let z=0;z<cubes[i+j].level(r, g, b);z++){
            push()
            translate(0, 0, z*scale);
            box(scale*pixelinc-gap)
            pop()
        }
        box(scale*pixelinc-gap)
        pop()
      }
    }

    return theta += 0.01
}