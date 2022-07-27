ctx.canvas.height = 400;
ctx.canvas.width = 1220;

// Start the frame count at 1
let frameCount = 1;
// Set the number of obstacles to match the current "level"
let obCount = frameCount;
// Create a collection to hold the generated x coordinates
const obXCoors = [];

const squareN = {
    height: 32,
    jumping: true,
    width: 32,
    x: 0,
    xVelocity: 0,
    y: 0,
    yVelocity: 0
};

// Create the obstacles for each frame
const nextFrame = () => {
    // increase the frame / "level" count
    frameCount++;
    for (let i = 0; i < obCount; i++) {
        // Randomly generate the x coordinate for the top corner start of the triangles
        let obXCoor = Math.floor(Math.random() * (1165 - 140 + 1) + 140);
        obXCoors.push(obXCoor);
    }
}

const controller = {
    left: false,
    right: false,
    up: false,
    keyListener: function (event) {
        log("--2", event.key)
        var key_state = (event.type == "keydown") ? true : false;

        switch (event.keyCode) {

            case 37: // left key
                controller.left = key_state;
                break;
            case 38: // up key
                controller.up = key_state;
                break;
            case 39: // right key
                controller.right = key_state;
                break;
        }
    }
};

const loop = function () {
    if (controller.up && squareN.jumping == false) {
        squareN.yVelocity -= 20;
        squareN.jumping = true;
    }

    if (controller.left) {
        squareN.xVelocity -= 0.5;
    }

    if (controller.right) {
        squareN.xVelocity += 0.5;
    }

    squareN.yVelocity += 1.5; // gravity
    squareN.x += squareN.xVelocity;
    squareN.y += squareN.yVelocity;
    squareN.xVelocity *= 0.9; // friction
    squareN.yVelocity *= 0.9; // friction

    // if squareN is falling below floor line
    if (squareN.y > 386 - 16 - 32) {
        squareN.jumping = false;
        squareN.y = 386 - 16 - 32;
        squareN.yVelocity = 0;

    }

    // if squareN is going off the left of the screen
    if (squareN.x < -20) {
        squareN.x = 1220;

    } else if (squareN.x > 1220) { // if squareN goes past right boundary
        squareN.x = -20;
        nextFrame();
    }
    // Creates the backdrop for each frame
    ctx.fillStyle = "#201A23";
    ctx.fillRect(0, 0, 1220, 400); // x, y, width, height


    // Creates and fills the cube for each frame
    ctx.fillStyle = "#8DAA9D"; // hex for cube color
    ctx.beginPath();
    ctx.rect(squareN.x, squareN.y, squareN.width, squareN.height);
    ctx.fill();


    // Create the obstacles for each frame
    // Set the standard obstacle height
    const height = 200 * Math.cos(Math.PI / 6);

    ctx.fillStyle = "#FBF5F3"; // hex for triangle color
    obXCoors.forEach((obXCoor) => {
        ctx.beginPath();
        ctx.moveTo(obXCoor, 385); // x = random, y = coor. on "ground"
        ctx.lineTo(obXCoor + 20, 385); // x = ^random + 20, y = coor. on "ground"
        ctx.lineTo(obXCoor + 10, 510 - height); // x = ^random + 10, y = peak of triangle
        ctx.closePath();
        ctx.fill();
    })
    // Creates the "ground" for each frame
    ctx.strokeStyle = "#2E2532";
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.moveTo(0, 385);
    ctx.lineTo(1220, 385);
    ctx.stroke();

    // call update when the browser is ready to draw again
    window.requestAnimationFrame(loop);

};

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);