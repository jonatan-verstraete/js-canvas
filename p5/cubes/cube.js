let tx, ty, tz, gap, rows, cols, depths;
let w3D, h3D, d3D;


function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    camera();
    //	ortho();
    let cube = 80;

    tx = cube;
    ty = cube;
    tz = cube;

    gap = 10;

    rows = 3;
    cols = 1;
    depths = 1;

    theta = 10;

    w3D = tx * (cols - 1);
    h3D = ty * (rows - 1);
    d3D = tz * (depths - 1);
    noStroke();

}

function draw() {
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