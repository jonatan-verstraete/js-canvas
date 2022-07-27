function a() { // HTML SCSS JSResult Skip Results Iframe
    // EDIT ON
    // console.clear();


    if (window.devicePixelRatio > 1) {
        cnv.width = cnv.clientWidth * 2;
        cnv.height = cnv.clientHeight * 2;
        ctx.scale(1, 1);
    }

    /* ====================== */
    /* ====== letIABLES ===== */
    /* ====================== */
    let width = cnv.clientWidth; // Width of the cnv
    let height = cnv.clientHeight; // Height of the cnv
    const dots = []; // Every dots in an array

    /* ====================== */
    /* ====== CONSTANTS ===== */
    /* ====================== */
    /* Some of those constants may change if the user resizes their screen but I still strongly believe they belong to the Constants part of the letiables */
    const DOTS_AMOUNT = 1000; // Amount of dots on the screen
    const DOT_RADIUS = 2; // Radius of the dots
    let PROJECTION_CENTER_X = width / 2; // X center of the cnv HTML
    let PROJECTION_CENTER_Y = height / 2; // Y center of the cnv HTML
    let FIELD_OF_VIEW = width * 0.8;
    const CUBE_LINES = [
        [0, 1],
        [1, 3],
        [3, 2],
        [2, 0],
        [2, 6],
        [3, 7],
        [0, 4],
        [1, 5],
        [6, 7],
        [6, 4],
        [7, 5],
        [4, 5]
    ];
    const CUBE_VERTICES = [
        [-1, -1, -1],
        [1, -1, -1],
        [-1, 1, -1],
        [1, 1, -1],
        [-1, -1, 1],
        [1, -1, 1],
        [-1, 1, 1],
        [1, 1, 1]
    ];


    class Cube {
        constructor(x, y, z) {
            this.x = (Math.random() - 0.5) * width;
            this.y = (Math.random() - 0.5) * width;
            this.z = (Math.random() - 0.5) * width;
            this.radius = Math.floor(Math.random() * 12 + 10);

            TweenMax.to(this, Math.random() * 20 + 15, {
                x: (Math.random() - 0.5) * (width * 0.5),
                y: (Math.random() - 0.5) * (width * 0.5),
                z: (Math.random() - 0.5) * width,
                repeat: -1,
                yoyo: true,
                ease: Power2.EaseOut,
                delay: Math.random() * -35
            });
        }
        // Do some math to project the 3D position into the 2D cnv
        project(x, y, z) {
            const sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW + z);
            const xProject = (x * sizeProjection) + PROJECTION_CENTER_X;
            const yProject = (y * sizeProjection) + PROJECTION_CENTER_Y;
            return {
                size: sizeProjection,
                x: xProject,
                y: yProject
            }
        }
        // Draw the dot on the cnv
        draw() {
            // Do not render a cube that is in front of the camera
            if (this.z < -FIELD_OF_VIEW + this.radius) {
                return;
            }
            for (let i = 0; i < CUBE_LINES.length; i++) {
                const v1 = {
                    x: this.x + (this.radius * CUBE_VERTICES[CUBE_LINES[i][0]][0]),
                    y: this.y + (this.radius * CUBE_VERTICES[CUBE_LINES[i][0]][1]),
                    z: this.z + (this.radius * CUBE_VERTICES[CUBE_LINES[i][0]][2])
                };
                const v2 = {
                    x: this.x + (this.radius * CUBE_VERTICES[CUBE_LINES[i][1]][0]),
                    y: this.y + (this.radius * CUBE_VERTICES[CUBE_LINES[i][1]][1]),
                    z: this.z + (this.radius * CUBE_VERTICES[CUBE_LINES[i][1]][2])
                };
                const v1Project = this.project(v1.x, v1.y, v1.z);
                const v2Project = this.project(v2.x, v2.y, v2.z);
                ctx.beginPath();
                ctx.moveTo(v1Project.x, v1Project.y);
                ctx.lineTo(v2Project.x, v2Project.y);
                ctx.stroke();
            }
            // ctx.globalAlpha = Math.abs(this.z / (width * 0.5));
        }
    }

    function createDots() {
        // Empty the array of dots
        dots.length = 0;

        // Create a new dot based on the amount needed
        for (let i = 0; i < 100; i++) {
            dots.push(new Cube());
        }
    }

    /* ====================== */
    /* ======== RENDER ====== */
    /* ====================== */
    function render() {
        // Clear the scene
        ctx.clearRect(0, 0, width, height);

        // Loop through the dots array and draw every dot
        for (let i = 0; i < dots.length; i++) {
            dots[i].draw();
        }

        window.requestAnimationFrame(render);
    }


    // Function called after the user resized its screen
    function afterResize() {
        width = cnv.offsetWidth;
        height = cnv.offsetHeight;
        if (window.devicePixelRatio > 1) {
            cnv.width = cnv.clientWidth * 2;
            cnv.height = cnv.clientHeight * 2;
            ctx.scale(2, 2);
        } else {
            cnv.width = width;
            cnv.height = height;
        }
        PROJECTION_CENTER_X = width / 2;
        PROJECTION_CENTER_Y = height / 2;
        FIELD_OF_VIEW = width * 0.8;

        createDots(); // Reset all dots
    }

    // letiable used to store a timeout when user resized its screen
    let resizeTimeout;
    // Function called right after user resized its screen
    function onResize() {
        // Clear the timeout letiable
        resizeTimeout = window.clearTimeout(resizeTimeout);
        // Store a new timeout to avoid calling afterResize for every resize event
        resizeTimeout = window.setTimeout(afterResize, 500);
    }
    window.addEventListener('resize', onResize);

    // Populate the dots array with random dots
    createDots();

    // Render the scene
    window.requestAnimationFrame(render);
}


function b() {
    if (window.devicePixelRatio > 1) {
        cnv.width = cnv.clientWidth * 2;
        cnv.height = cnv.clientHeight * 2;
        ctx.scale(2, 2);
    }

    /* ====================== */
    /* ====== letIABLES ===== */
    /* ====================== */
    let width = cnv.offsetWidth; // Width of the cnv
    let height = cnv.offsetHeight; // Height of the cnv
    const dots = []; // Every dots in an array

    /* ====================== */
    /* ====== CONSTANTS ===== */
    /* ====================== */
    /* Some of those constants may change if the user resizes their screen but I still strongly believe they belong to the Constants part of the letiables */
    const DOTS_AMOUNT = 1000; // Amount of dots on the screen
    const DOT_RADIUS = 10; // Radius of the dots
    let PROJECTION_CENTER_X = width / 2; // X center of the cnv HTML
    let PROJECTION_CENTER_Y = height / 2; // Y center of the cnv HTML
    let PERSPECTIVE = width * 0.8;

    class Dot {
        constructor() {
            this.x = (Math.random() - 0.5) * width; // Give a random x position
            this.y = (Math.random() - 0.5) * height; // Give a random y position
            this.z = Math.random() * width; // Give a random z position
            this.radius = 10; // Size of our element in the 3D world

            this.xProjected = 0;
            this.yProjected = 0;
            this.scaleProjected = 0;

            TweenMax.to(this, (Math.random() * 10 + 15), {
                z: width,
                repeat: -1,
                yoyo: true,
                ease: Power2.easeOut,
                yoyoEase: true,
                delay: Math.random() * -25
            });
        }
        // Do some math to project the 3D position into the 2D cnv
        project() {
            this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);
            this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X;
            this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y;
        }
        // Draw the dot on the cnv
        draw() {
            this.project();
            ctx.globalAlpha = Math.abs(1 - this.z / width);
            ctx.fillRect(this.xProjected - this.radius, this.yProjected - this.radius, this.radius * 2 * this.scaleProjected, this.radius * 2 * this.scaleProjected);
        }
    }

    function createDots() {
        // Empty the array of dots
        dots.length = 0;

        // Create a new dot based on the amount needed
        for (let i = 0; i < DOTS_AMOUNT; i++) {
            // Create a new dot and push it into the array
            dots.push(new Dot());
        }
    }

    /* ====================== */
    /* ======== RENDER ====== */
    /* ====================== */
    function render() {
        // Clear the scene
        ctx.clearRect(0, 0, width, height);

        // Loop through the dots array and draw every dot
        for (let i = 0; i < dots.length; i++) {
            dots[i].draw();
        }

        window.requestAnimationFrame(render);
    }


    // Function called after the user resized its screen
    function afterResize() {
        width = cnv.offsetWidth;
        height = cnv.offsetHeight;
        if (window.devicePixelRatio > 1) {
            cnv.width = cnv.clientWidth * 2;
            cnv.height = cnv.clientHeight * 2;
            ctx.scale(2, 2);
        } else {
            cnv.width = width;
            cnv.height = height;
        }
        PROJECTION_CENTER_X = width / 2;
        PROJECTION_CENTER_Y = height / 2;
        PERSPECTIVE = width * 0.8;

        createDots(); // Reset all dots
    }

    // letiable used to store a timeout when user resized its screen
    let resizeTimeout;
    // Function called right after user resized its screen
    function onResize() {
        // Clear the timeout letiable
        resizeTimeout = window.clearTimeout(resizeTimeout);
        // Store a new timeout to avoid calling afterResize for every resize event
        resizeTimeout = window.setTimeout(afterResize, 500);
    }
    window.addEventListener('resize', onResize);

    // Populate the dots array with random dots
    createDots();

    // Render the scene
    window.requestAnimationFrame(render);
}

b()