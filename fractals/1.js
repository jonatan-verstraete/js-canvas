function mandelbot() {
    for (let x = 0; x < 200; x++) {
        for (let y = 0; y < 200; y++) {

            let i = 0;
            let cx = -2 + x / 50;
            let cy = -2 + y / 50;
            let zx = 0;
            let zy = 0;


            while (i < 255 && (zx * zx + zy * zy) < 4) {
                let xt = zx * zy;
                zx = zx * zx - zy * zy + cx;
                zy = 2 * xt + cy;
                i++;
            }

            let color = i.toString(16);
            ctx.beginPath();
            ctx.rect(x * 4, y * 4, 4, 4);
            ctx.fillStyle = '#' + color + color + color;
            ctx.fill();
        }
    }
}

let creal = -.8
let cimag = .156;
let frame = 0;
const size = 4

const pallette = [];

function julia() {
    for (y = 0; y < 200; y++) {
        for (x = 0; x < 200; x++) {
            let cx = -2 + x / 50;
            let cy = -2 + y / 50;
            let i = 0;

            while ((cx * cx + cy * cy < 4) && i < 25) {
                xt = cx * cx - cy * cy + creal;
                cy = 2 * cx * cy + cimag;
                cx = xt;
                i++;
            }

            ctx.beginPath();
            ctx.rect(x * size, y * size, size*2, size * 2);
            ctx.fillStyle = pallette[i];
            ctx.fill();
        }
    }
    frame++;
    creal = -.8 + .6 * Math.sin(frame / (3.14 * 20))
    cimag = .156 + .4 * Math.cos(frame / (3.14 * 40))

}

for (x = 0; x < 9; x++) // this loop populates the color pallette array
{
    color = (31 * x).toString(16); // convert the number to hex
    if (color.length == 1) color = '0' + color; // add a zero in front if only one hex digit
    pallette[x] = "#" + color + color + 'ff'; // colors 0-8: the Red and Green components change, Blue=FF
    pallette[x + 8] = '#00ff' + color; // colors 8-16: the Blue component changes, Red and Green=FF
    pallette[17 + x] = "#" + color + '0000'; // colors 17-25: the Red component changes, Green and Blue=0
}

a = setInterval(julia, 100);