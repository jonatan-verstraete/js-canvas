
let video;


function setup() {
  video = createCapture(VIDEO);
  video.size(128, 96);
  scale = 8
  createCanvas(128*scale, 96*scale); 
}

function draw() {
  if (pause) return
  video.loadPixels();

  for (let j = 0; j < video.height; j++) {
    for (let i = 0; i < video.width; i++) {
      const pixelIndex = (i + j * video.width) * 4;
      const r = video.pixels[pixelIndex + 0];
      const g = video.pixels[pixelIndex + 1];
      const b = video.pixels[pixelIndex + 2];
      const avg = (r + g + b)/3
      fill(avg)
      fill(r,g,b)
      noStroke()
      rect(video.width*scale-(i*scale), j*scale, scale, scale);



    }
  }
}
