async function getImgPixels(borderFiltered = true) {
    const res = []
    const imgRes = ctx.getImageData(0, 0, cnv.width, cnv.height)
    const imgData = imgRes.data;
    const exeptionalFilteredColors = [
        "#00000000ff"
    ];
    const filtergrade = 4

    let idx = 0
    for (let y = 0; y < imgRes.height; ++y) {
        for (let x = 0; x < imgRes.width; ++x) {
            if(imgData[idx] != undefined && idx % filtergrade == 0) {
                const cln = parseColor([imgData[idx], imgData[idx + 1], imgData[idx + 2]])

                if(cln.replace(/^#(.)\1+/, "") !== "" && !exeptionalFilteredColors.includes(cln)) {
                    res.push({
                        x: x,
                        y: y,
                        cl: cln,
                    })
                } 
            }
            idx += 4
        }
    }
    return res
}