const spaced = 0
const width = 2.05 + spaced; //width with gap

const cubes = [];
const cubeBlueprint = [
    [
        [-1, -1, 1],
        [-1, 1, 1],
        [1, 1, 1],
        [1, -1, 1], "#FC6303"
    ], //FRONT
    [
        [-1, -1, -1],
        [-1, -1, 1],
        [1, -1, 1],
        [1, -1, -1], "#02811a"
    ], //BOTTOM
    [
        [-1, -1, -1],
        [1, -1, -1],
        [1, 1, -1],
        [-1, 1, -1], "#FF3730"
    ], //BACK
    [
        [-1, 1, -1],
        [1, 1, -1],
        [1, 1, 1],
        [-1, 1, 1], "#013291"
    ], //TOP
    [
        [1, -1, -1],
        [1, -1, 1],
        [1, 1, 1],
        [1, 1, -1], "#FFE900"
    ], //LEFT
    [
        [-1, -1, -1],
        [-1, 1, -1],
        [-1, 1, 1],
        [-1, -1, 1], "#EFEFEF"
    ] //RIGHT         
];


function getSideColor(x, y, z, colorCode, color) {
    let colorDisplay = "#333333";
    if ((colorCode === 0 && z === 1) || (colorCode === 2 && z === -1) || (colorCode === 1 && y === -1) || (colorCode === 3 && y === 1) || (colorCode === 4 && x === 1) || (colorCode === 5 && x === -1)) {
        colorDisplay = color;
    }
    return colorDisplay;
}

function copyCubes(x, y, z, cnt) {
    const x1 = x * width;
    const y1 = y * width;
    const z1 = z * width;
    for (let i = 0; i < 6; i++) {
        const color = getSideColor(x, y, z, i, cubeBlueprint[i][4]);
        let newCube = [0, 0, 0, 0, color, i];
        for (let j = 0; j < 4; j++) {
            newCube[j] = [cubeBlueprint[i][j][0] + x1, cubeBlueprint[i][j][1] + y1, cubeBlueprint[i][j][2] + z1, 0, 0, 0, cnt];
        }
        cubes.push(newCube);
    }
}

let radTurn = Math.PI / -30;

//rotates the cubes
function rotateAxis(c) {
    return [c[0], Math.cos(radTurn) * c[1] - Math.sin(radTurn) * c[2], Math.sin(radTurn) * c[1] + Math.cos(radTurn) * c[2]];
}

//Without this function we would have a disco effect with the drawing of lines!
function whosOnTop(a, b) {
    let xx = Math.min(a[0][2], a[1][2], a[2][2]) - Math.min(b[0][2], b[1][2], b[2][2]);
    return xx;
}

let left = [17, 18, 19, 20, 21, 22, 23, 24, 25];
let center = [9, 10, 11, 12, 13, 14, 15, 16];
let right = [0, 1, 2, 3, 4, 5, 6, 7, 8];

let topp = [6, 7, 8, 14, 15, 16, 23, 24, 25];
let middle = [3, 4, 5, 12, 13, 22, 21, 20];
let bottom = [0, 1, 2, 9, 10, 11, 19, 18, 17];

let turna0 = turna1 = turna2 = turna3 = false;
let turnb0 = turnb1 = turnb2 = turnb3 = false;
let turnc0 = false;

function calcNewPosition() {

    for (let i = 0; i < cubes.length; i++) {
        for (let j = 0; j < 4; j++) {

            let cubeId = cubes[i][j][6];

            let a0 = a1 = a2 = a3 = false;
            if (turna0) a0 = true;
            if (turna1) a1 = left.indexOf(cubeId) >= 0;
            if (turna2) a2 = center.indexOf(cubeId) >= 0;
            if (turna3) a3 = right.indexOf(cubeId) >= 0;

            let b0 = b1 = b2 = b3 = false;
            if (turnb0) b0 = true;
            if (turnb1) b1 = topp.indexOf(cubeId) >= 0;
            if (turnb2) b2 = middle.indexOf(cubeId) >= 0;
            if (turnb3) b3 = bottom.indexOf(cubeId) >= 0;

            let c0 = false;
            if (turnc0) c0 = true;


            let tempCube = [cubes[i][j][0], cubes[i][j][1], cubes[i][j][2]];
            //rotate on x axis            
            if (a0 || a1 || a2 || a3) {
                tempCube = rotateAxis([tempCube[0], tempCube[1], tempCube[2]]);
                tempCube = [tempCube[0], tempCube[1], tempCube[2]];
            }
            //rotate on the y axis
            if (b0 || b1 || b2 || b3) {
                tempCube = rotateAxis([tempCube[1], tempCube[0], tempCube[2]]);
                tempCube = [tempCube[1], tempCube[0], tempCube[2]];
            }
            //rotate on z axis
            if (c0) {
                tempCube = rotateAxis([tempCube[2], tempCube[0], tempCube[1]]);
                tempCube = [tempCube[1], tempCube[2], tempCube[0]];
            }

            cubes[i][j] = [tempCube[0], tempCube[1], tempCube[2], tempCube[0] * (200 / (tempCube[2] - 20)), tempCube[1] * (200 / (tempCube[2] - 20)), tempCube[2] - 10, cubeId];
        }
    }
}





function renderCubes() {
    for (i = 0; i < cubes.length; i++) {
        if (Math.min(cubes[i][0][5], cubes[i][1][5], cubes[i][2][2]) < 0 && 0 < ((cubes[i][0][3] - cubes[i][1][3]) * (cubes[i][2][4] - cubes[i][1][4]) - (cubes[i][0][4] - cubes[i][1][4]) * (cubes[i][2][3] - cubes[i][1][3]))) {
            ctx.beginPath();
            for (a = 0; a < 4; a++) {
                (a == 0) ? ctx.moveTo(cubes[i][a][3] + Ymid, cubes[i][a][4] + Ymid): ctx.lineTo(cubes[i][a][3] + Ymid, cubes[i][a][4] + Ymid);
            }
            ctx.closePath();
            ctx.fillStyle = cubes[i][4];
            ctx.strokeStyle = "#000";
            ctx.fill();
            ctx.stroke();
        }
    }
}

function drawCubes() {
    calcNewPosition();
    cubes.sort(whosOnTop);
    renderCubes();
}

function initCube() {
    //Generate the 3X3 grid of cubes where the center is at 0,0
    let cnt = 0;
    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            for (let z = -1; z < 2; z++) {
                if (x == 0 && y == 0 && z == 0) {
                    continue; //No need to render the center cube
                }
                copyCubes(x, y, z, cnt++);
            }
        }
    }
    animateCube();
    turna0 = true;

}

let stop = false;
let spinCounter = 0;

function animateCube() {
    ctx.fillStyle = "rgb(50,50,50)";
    ctx.fillRect(0, 0, cn.width, cn.height);
    drawCubes(ctx);
    moveParts();
    if (!stop) setTimeout(animateCube, 75);
    if (turna0 || turna1 || turna2 || turna3 || turnb0 || turnb1 || turnb2 || turnb3 || turnc0) spinCounter += 6; //radTurn;
}

function moveParts() {
    if (spinCounter == 90) {
        turna0 = false;
        turna1 = true;
    } else if (spinCounter == 120) {
        turna3 = true;
    } else if (spinCounter == 180) {
        turna2 = true;
        turna0 = false;
    } else if (spinCounter == 210) {
        turna3 = false;
    } else if (spinCounter == 270) {
        turna2 = false;
    } else if (spinCounter == 540) {
        turna1 = false;
        turna0 = true;
    } else if (spinCounter == 720 - 6) {
        turna0 = false;
        turnb2 = true;
    } else if (spinCounter == 810 - 6) {
        turnb2 = false;
        turnb1 = true;
        turnb3 = true;
    } else if (spinCounter == 1080 - 6) {
        turnb2 = true;
        turnb1 = false;
        turnb3 = false;
    } else if (spinCounter == 1260 - 6) {
        turnb2 = false;
        turnb0 = true;
    } else if (spinCounter == 1350 - 6) {
        turnc0 = true;
        turnb0 = false;
    } else if (spinCounter == 1440) {
        turna0 = true;
    } else if (spinCounter == 1530 + 6) {
        turnb0 = true;
    } else if (spinCounter == 2424) {
        turnc0 = false;
    } else if (spinCounter == 2880) {
        turna0 = false;
    } else if (spinCounter == 2970 + 6) {
        turnb0 = false;
        turnc0 = true;
    } else if (spinCounter == 3102) {
        turnc0 = false;
        turna0 = true;
    } else if (spinCounter > 3306 && spinCounter % 102 == 0) {
        turnb0 = (Math.random() > .5);
        if (!turna0 && !turnc0) turnb0 = true;
    } else if (spinCounter > 3306 && spinCounter % 210 == 0) {
        turnc0 = (Math.random() > .5);
        if (!turnb0 && !turna0) turnc0 = true;
    } else if (spinCounter > 3306 && spinCounter % 42 == 0) {
        turna0 = (Math.random() > .5);
        if (!turnb0 && !turnc0) turna0 = true;
    }

}

initCube()