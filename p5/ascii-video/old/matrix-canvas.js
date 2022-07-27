let density = ""
density = "Ñ@#W$9876543210?!abc;:+=-,._`````";
//density = '.:-i|=+%O#@'
//density = '.•`*+ù£#      '

const detail = 1
const vidWidth = 128
const vidHeight = 96
const pxScale = 10
const amtOfWords = 300

let video;
let seedInterval;
let cols = 0
let words = []


function seeder() {
  seedInterval = setInterval(() => {
    if (!pause) {
      words.push(new Word())
    }
  }, 5)
}

function characterEncoding(n, mutate=false) {
  if (!n) return n
  const uniVal = 20000
  if (mutate) {
    n = n.codePointAt(0) + -uniVal + randint(1, 10 * mutate)
  }
  return String.fromCodePoint(uniVal + int(n))
}

function drawBackground() {
  for (let j = 0; j < video.height; j+=detail) {
    for (let i = 0; i < video.width; i+=detail) {
      const pixelIndex = (i + j * video.width) * 4;
      const r = video.pixels[pixelIndex + 0];
      const g = video.pixels[pixelIndex + 1];
      const b = video.pixels[pixelIndex + 2];

      const cl = map((r + g + b)/3, 0, 255, 0, 1)

      fill("rgba(0,255,0,"+cl*0.1+")")
      square(i*pxScale, j*pxScale, pxScale);

     // text(characterEncoding(i*j), i*pxScale, j*pxScale);
    }
  }
}



class Word {
  constructor() {
    this.length = randint(10, 50)
    this.signseed = randint(500)
    this.speed = pxScale

    this.x = floor(random(cols*0.2, cols*0.7)) * pxScale
    this.y = -this.length * pxScale - randint(2000)

    this.signs = range(this.length).map(i => characterEncoding(i + 1 + this.signseed))
  }
  reincarnate(){
    words.remove(this)
    words.push(new Word())
  }

  draw() {
    if (this.y - this.length * pxScale > height) return this.reincarnate()

    if (randint(1) == 0) {
      const r = randint(this.signs.length - 1)
      this.signs[r] = characterEncoding(this.signs[r], this.length)
    }
    this.signs.forEach((sign, idx) => {
      const x = int(map(this.x, 0, width, 0, vidWidth))
      const y = int(map(this.y + idx * pxScale, 0, height + this.length * pxScale, 0, vidHeight))

      const pixelIndex = (x + y * video.width) * 4;
      if (pixelIndex < 0 || pixelIndex > video.width*video.height*pxScale) return


      const r = video.pixels[pixelIndex + 0];
      const g = video.pixels[pixelIndex + 1];
      const b = video.pixels[pixelIndex + 2];

      const cl = map((r + g + b) / 3, 0, 255, 0, 1)

      fill("rgba(0,250,0," + cl + ")")
      text(sign, (x) * pxScale, y * pxScale);

    })
    this.y += this.speed
  }
}










function setup() {
  createCanvas(window.innerWidth, window.innerHeight)
  video = createCapture(VIDEO);
  video.size(vidWidth, vidHeight);
  noStroke()
  textSize(pxScale);
  textFont('Consolas');

  cols = floor(width / pxScale)
  for(let i=0;i<amtOfWords;i++) words.push(new Word())
  // seeder()
  //frameRate(5)
}

function draw() {
  background("#111")
  video.loadPixels();
  words.forEach(i => i.draw())
}


