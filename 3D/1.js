class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
// cube parameters
const cx = Xmax / 2;
const cy = Ymax / 2;
const cz = 0;
const size = Ymax / 4;

const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0], // back face
    [4, 5], [5, 6], [6, 7], [7, 4], // front face
    [0, 4], [1, 5], [2, 6], [3, 7] // connecting sides
];


//     <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TweenMax.min.js"></script>


const vertices = [
    new Point(cx - size, cy - size, cz - size),
    new Point(cx + size, cy - size, cz - size),
    new Point(cx + size, cy + size, cz - size),
    new Point(cx - size, cy + size, cz - size),
    new Point(cx - size, cy - size, cz + size),
    new Point(cx + size, cy - size, cz + size),
    new Point(cx + size, cy + size, cz + size),
    new Point(cx - size, cy + size, cz + size)
];

let angle = 8 * 0.001 * 10 * Math.PI * 2;
for (let v of vertices) {
    const dx = v.x - cx;
    const dz = v.z - cz;
    const x = dz * Math.sin(angle) + dx * Math.cos(angle);
    const z = dz * Math.cos(angle) - dx * Math.sin(angle);
    v.x = x + cx;
    v.z = z + cz;
}

for (let v of vertices) {
    const dy = v.y - cy;
    const dz = v.z - cz;
    const y = dy * Math.cos(angle) - dz * Math.sin(angle);
    const z = dy * Math.sin(angle) + dz * Math.cos(angle);
    v.y = y + cy;
    v.z = z + cz;
}

for (let edge of edges) {
    ctx.beginPath();
    ctx.moveTo(vertices[edge[0]].x, vertices[edge[0]].y);
    ctx.lineTo(vertices[edge[1]].x, vertices[edge[1]].y);
    ctx.stroke();
}




function cube({
    pX = 220,
    pY = 100,
    s = 100
} = {}) {
    ctx.beginPath()
    ctx.moveTo(pX, pY)
    ctx.lineTo(pX + s, pY)
    ctx.lineTo(pX + s, pY + s)
    ctx.lineTo(pX, pY + s)
    ctx.lineTo(pX, pY)
    ctx.stroke()
}