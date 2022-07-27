
let density = ""
density = "Ñ@#W$9876543210?!abc;:+=-,._                    ";
//density = '.:-i|=+%O#@'
//density = '.•`*+ù£#      '
const detail = 2


let video;
let asciiDiv;

function setup() {
  noCanvas();
  video = createCapture(VIDEO);
  video.size(128, 96);
  asciiDiv = createDiv();
}

function draw() {
  if (pause) return
  video.loadPixels();
  let asciiImage = "";
  for (let j = 0; j < video.height; j+=detail) {
    for (let i = 0; i < video.width; i+=detail) {
      const pixelIndex = (i + j * video.width) * 4;
      const r = video.pixels[pixelIndex + 0];
      const g = video.pixels[pixelIndex + 1];
      const b = video.pixels[pixelIndex + 2];

      const charIndex = floor(map((r + g + b)/3, 0, 255, 0, density.length-1));
      let c = density.charAt(charIndex);

      asciiImage += "<span style='color:hsl(111deg, 100%, "+floor(map((r + g + b)/3, 0, 255, 0, 60))+"%)'>"
      if (c == " " || !c) asciiImage += "&nbsp;";
      else asciiImage += c;
      asciiImage += "</span>"
    }
    asciiImage += '<br/>';
  }
  asciiDiv.html(asciiImage);
}
