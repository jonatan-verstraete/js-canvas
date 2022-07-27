
let density = ""
density = "Ñ@#W$9876543210?!abc;:+=-,._`````";
//density = '.:-i|=+%O#@'
//density = '.•`*+ù£#      '

const detail =1
let video;
let asciiDiv;
const pxScale = 10
const winWidth = floor(window.innerWidth/pxScale)

function setup() {
  createCanvas(window.innerWidth, window.innerHeight)
  video = createCapture(VIDEO);
  video.size(128, 96);
  noStroke()
  textSize(1.8*pxScale);
  textFont('Consolas');
}

function draw() {
  background("#111")
  video.loadPixels();

  for (let j = 0; j < video.height; j+=detail) {
    for (let i = 0; i < video.width; i+=detail) {
      const pixelIndex = (i + j * video.width) * 4;
      const r = video.pixels[pixelIndex + 0];
      const g = video.pixels[pixelIndex + 1];
      const b = video.pixels[pixelIndex + 2];

      const charIndex = floor(map((r + g + b)/3, 0, 255, 0, density.length-1));
      let c = density.charAt(charIndex);

      const cl = map((r + g + b)/3, 0, 255, 0, 1)

      fill("rgba(0,255,0,"+cl+")")
      text(c, i*pxScale, j*pxScale);

    }
  }
}


class Stream {
  constructor(id){
    this.id=id
    this.x=floor(random(0, [...new Array(winWidth)].map((i, idx)=>idx)) )
    this.speed=pxScale
    this.length=8
    this.signs = 
    log(this.x)
  }

}