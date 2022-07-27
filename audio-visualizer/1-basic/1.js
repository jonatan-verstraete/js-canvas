const Main = () => {
    const audioElement = document.getElementById("audio_01");
    // help audio node
    const audioCtx = new AudioContext();
    // analyser node gives frequency
    const analyser = audioCtx.createAnalyser();
    // size of datassxs
    analyser.fftSize = 512 // 2048
    // convert domElm to audioElm
    const source = audioCtx.createMediaElementSource(audioElement);
    source.connect(analyser);
    // connnects to output device
    source.connect(audioCtx.destination);

    let data = new Uint8Array(analyser.frequencyBinCount)
    const Effect = new Effects({shapeData: getShapeData()})


    audioElement.onplay = () => {
        audioCtx.resume();
        requestAnimationFrame(animate);
    }

    function animate() {
        requestAnimationFrame(animate);
        analyser.getByteFrequencyData(data);
        Effect.linesDouble(data.slice(0, data.length/1.3));
    }
    audioElement.play()
}

document.getElementById("start").onclick = (e) => {
    e.target.parentElement.remove()
    Main()
}


function action2(dataSize = 500) {
    const s = 100
    const tileSize = (cnv.width / s)  + (dataSize / s) 
    let space = 5
    for (let x = 0; x < cnv.width; x++) {
        for (let y = 0; y < cnv.width; y++) {
            square(x * tileSize - space, y * tileSize - space, tileSize - space, "green")
        }        
    }
}

function getShapeData() {
    const res = new Map()
    ctx.lineWidth = 5
    let s = 20
    let s2 = s/2
    ctx.rect(Xmid - s2, Ymid - s2, s, s)
    // ctx.rect(Xmid - s2 /2, Ymid - s2 /2, s2, s2)
    ctx.stroke()
    const image = ctx.getImageData(Xmid - s2, Ymid - s2, s, s)
    let idx = 0

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            if(image.data[idx + 3] == 255) {
                res.set(`${Xmid - s2 + x}:${Xmid - s2 + y}`, true)
            }
            idx += 4
        }        
    }
    return res
}





