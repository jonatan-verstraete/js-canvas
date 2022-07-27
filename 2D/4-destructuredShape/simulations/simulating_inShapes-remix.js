const pointsSetup = Object.freeze({
    size: 5, 
    amount: 1850,
    speed: 3,
})

const ruleSetup = Object.freeze({
    maxClusterSize: 5,
    clusterReach: 10,
})

let mainSize = 200
const magicNumber = 5.8//6.935

function getCirclePoints(mx = Xmid, my = Ymid, rot = 0) {
    const res = []
    const detail = 30
    const r = mainSize
    for (let i = 0; i < 360; i++) {
        const a = degRad(overcount(i + rot, 360));
        let x1 = mx + Math.cos(a) * r;
        let y1 = my + Math.sin(a) * r;
        if (i % round(30) === 0) res.push({
            x: x1,
            y: y1,
            i: i
        })
    }
    return {size: r*2, pts: res};
}

function getShape(show = true, pr = 0) {
   // return getCirclePoints(Xmid, Ymid, pr)
    const res = []
    let s = mainSize, x=Xmid, y = Ymid, r = 0.519 + pr;

    if(show) triangle(Xmid, Ymid, s, false, {stroke: "gray", rotate: pr*85})

    const a = ((Math.PI * 2) / 3);
    for (let i = 0; i < 3; i++) {
        if(show) point(x+s* Math.cos(a*i+r), y+s* Math.sin(a*i+r), 10, "orange");
        res.push({
            x: round(x+s* Math.cos(a*i+r)), 
            y: round(y+s* Math.sin(a*i+r)),
        })
    }
    return {size: s, pts: res};
}


function insideOfShape(shape) {

    function piontInShapeRemix (p, shape) {      
        const x = p.x; const y = p.y
      
        let inside = false
        for (let i = 0, j = shape.length - 1; i < shape.length; j = i++) {
          const xi = shape[i].x; const yi = shape[i].y
          const xj = shape[j].x; const yj = shape[j].y

          const intersect = (xi === x && yi === y)||(((yi > y) !== (yj < y)  ) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi))
          if (intersect) inside = !inside
        }
      
        return inside
    };


    shape.pts.push({x:1200, y:200})
    const points = range(pointsSetup.amount).map(i=>({x:randint(Xmax), y:randint(Ymax), inZone:false})) // [{x:Xmid, y:Ymid}]// 
    points.push(
        {x:shape.pts[0].x, y:shape.pts[0].y},
        {x:shape.pts[1].x, y:shape.pts[1].y},
        {x:shape.pts[2].x, y:shape.pts[2].y}
    );

    points.forEach((i, idx)=>{ 
        points[idx].inZone = piontInShapeRemix(i, shape.pts)
        point(i.x, i.y, pointsSetup.size, i.inZone ? "red" : "cyan")        
    })
}






async function simulate() {
    const stats = []
    let i = 0, exit = false;
    while(!exit) {
        i+=0.05
        if(i>100) exit = true
        clear()
        const shapeData = getShape(false, i) 
       insideOfShape(shapeData)

        await sleep(0.1)
        await pauseHalt()
    }
}

simulate()
