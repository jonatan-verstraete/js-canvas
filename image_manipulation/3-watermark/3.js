
const main = async()=> {
    const imgMarker = new ImgMarker()
    let W = 200, H = 100;

    const pattern = await strToCoords("!!c4567A$4567%912)-456nl9o23BCÿÿ", W, H)
    await imgMarker.setPattern(pattern, W, H)

    const valid = imgMarker.valiedateImg(pattern)
    console.log(reversedScaleCoords(valid))


}

main()