function scaleCoords(asci, width, hight ,asciIdxReach = 127 ) {
    const res = arrayChuck(asci, 2)
    //255
    res.forEach((i, idx)=> {
        i[0] = Math.round( i[0] * width / asciIdxReach )
        i[1] = Math.round( i[1] * hight / asciIdxReach )

    })
    return res
}


function reversedScaleCoords(asci, width, hight, asciIdxReach = 127 ) {
    //255
    asci.forEach((i, idx)=> {
        i[0] = Math.round( i[0] / width * asciIdxReach )
        i[1] = Math.round( i[1] / hight * asciIdxReach )
    })
    return asci
}

async function strToCoords(str = "", W, H) {
    const hashLength = 32
    if(String(str).length !== hashLength) {
        return new Error('Not valid length')
    }
    const currentTime = new Date().getTime()
    const _consts = Math.PI.toFixed(hashLength).split(".")[1].split("")


    let asciFormat = []
    str.split("").forEach((i, idx) => {
        let c = +i.charCodeAt(0) + idx;
        if (!isNaN(c)) asciFormat.push(c)
    })

    return scaleCoords(asciFormat, W, H)
}