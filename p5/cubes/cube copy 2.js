let tx, ty, tz, gap, rows, cols, depths;
let w3D, h3D, d3D;

let video;
let prevpixels;

function setup() {
    const constraints = {
        video: {
          optional: [{ maxFrameRate: 10 }]
        },
        audio: false
    };
    frameRate(10)

    video = createCapture(VIDEO);
    video.size(128, 96);
    //video.hide()

    createCanvas(windowWidth, windowHeight, WEBGL);

    camera();
    noStroke();
    //	ortho();
    let cube = 80;

    tx = cube;
    ty = cube;
    tz = cube;

    gap = 0;

    rows = 3;
    cols = 1;
    depths = 1;
    theta = 10;

    w3D = tx * (cols - 1);
    h3D = ty * (rows - 1);
    d3D = tz * (depths - 1);

    scale = 10
    pixelinc = 5
}

function draw() {
    background(255)
    if (pause) return

    orbitControl();

    //directionalLight(0, 150, 190, -200, -200, 1);

    video.loadPixels();

  
    for (let j = 0; j < video.height; j+=pixelinc) {
      for (let i = 0; i < video.width; i+=pixelinc) {
        push();
        translate(video.width*scale-(i*scale)+gap, j*scale+gap, 0);

        const pxidx = (i + j * video.width) * 4;
        const r = video.pixels[pxidx+0];
        const g = video.pixels[pxidx+1];
        const b = video.pixels[pxidx+2];
        fill(r,g,b)

        if(prevpixels) {
            const avg = (g+b+r)/3
            const pr = prevpixels[pxidx+0];
            const pg = prevpixels[pxidx+1];
            const pb = prevpixels[pxidx+2];
            const prevavg = (pg+pb+pr)/3

            if(abs(prevavg - avg) < 20) {
                fill(pr, pg, pb)
            }
        }

        //ambientMaterial(r,g,b);

        box(scale*pixelinc-gap)
        //box(video.width*scale-(i*scale)+gap, j*scale+gap, scale*pixelinc-gap);
        //rect(video.width*scale-(i*scale) +gap, j*scale +gap, sc-gap, sc-gap);
       // box(tx - gap, ty - gap, tz - gap);
        pop()
      }
    }
    if(theta%0.5===0) prevpixels = [...video.pixels]
    return theta += 0.01
    background(255);
    // control with Mouse ou paddle : click ans drag
    //orbitControl();


    directionalLight(0, 150, 190, -200, -200, 1);
    directionalLight(190, 50, 0, 200, 200, 1);

    ambientMaterial(255);

    //camera(0, 0, (height/2.0) / tan(PI*30.0 / 180.0), 0, 0, 0, 0, 1, 0);
    //camera(0, 0, 90 , 0, 0, 0, 0, 1, 0);
    camera(0, 0, 400, 0, 0, 0, 0, 1, 0);

    //rotateZ(theta);
    rotateY(theta);
    rotateX(theta);
    // translate(-w3D / 2, -h3D / 2, d3D / 2);



    // directionalLight(255, 53, 243, width, -height, 0.05);
    // directionalLight(255, 219, 78, -width, height, 0.05);
    // directionalLight(28, 178, 161, -width, -height, 0.05);
    // directionalLight(178, 19, 169, width, height, 0.05);





    for (let i = 0; i < cols; i++) {
        push();
        translate(tx * i, 0, 0);

        for (let j = 0; j < rows; j++) {
            push();
            translate(0, ty * j, 0);

            for (let k = 0; k < depths; k++) {
                push();
                translate(0, 0, (tz * k) - d3D);

                // rotation inverse : the center is always in front of you
                // rotateX(-theta);
                // rotateY(-theta);
                // rotateZ(-theta);

                box(tx - gap, ty - gap, tz - gap);
                pop();
            }
            pop();
        }
        pop();
    }
    theta += 0.01;
}