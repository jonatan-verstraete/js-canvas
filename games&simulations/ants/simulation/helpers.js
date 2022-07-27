function smoothSquareWave(t, delta = .1, amp=1, freq=1/PI2) {
    // https://dsp.stackexchange.com/questions/35211/generating-smoothed-versions-of-square-wave-triangular-etc
    return (amp/atan(1/delta))*atan(sin(2*PI*t*freq)/delta);
}


function autoNoise(x, y) {
    const {df, zoff, zoffAmount} = SETUP.noise
    SETUP.noise.zoff += zoffAmount
    return noise.simplex3(x/df,  y/df, zoff)
}


function showStats(obj) {
    const {x, y}= obj
    const food = obj.food||""
    const track = obj.food||""
    const s = GRID.detail/3
    rect(x, y, x+s, y-numMax(food.length*8, 50), null, "green")
    rect(x+s, y, x+s*2, y-(track.length*2), null, "orange")
}

function placeFood(x, y,  size=20, amt=100, spread=0.1) {
    const {x:_x, y:_y} = GRID.getClosest(x, y)
    const p = {x:_x, y:_y}

    // assign food value based on distance to (x, y)
    const _ = GRID.getPointsInRange(_x, _y, size).forEach(i=> {
        const _dis = 1.41425*GRID.detail - distanceTo(i, p)
        i.food = ceil(_dis*amt) //(smoothSquareWave(_dis, spread))
    })
}

// const fullLog = []
// function stat() {

// }