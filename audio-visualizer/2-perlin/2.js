const Main = () => {
    const audioElement = document.getElementById("audio_01");
    // help audio node
    const audioCtx = new AudioContext();
    // analyser node gives frequency
    const analyser = audioCtx.createAnalyser();
    // size of data
    analyser.fftSize = 256; // 2048
    // convert domElm to audioElm
    const source = audioCtx.createMediaElementSource(audioElement);
    source.connect(analyser);
    // connnects to output device
    source.connect(audioCtx.destination);

    let data = new Uint8Array(analyser.frequencyBinCount)
    const Effect = new Effects() 


    audioElement.onplay = () => {
        pause = false
        audioCtx.resume();
        animate();
    }
    audioElement.onpause = () => {
        log(data)
        pause = true
    }
    async function animate() {
        analyser.getByteFrequencyData(data);
        Effect.perlin(data.slice(0, 100));
        if(pause) {
            audioElement.pause()
        }
        await pauseHalt()
        // if(!pause && audioElement.paused) {
        //     audioElement.play()
        // }
        requestAnimationFrame(animate);
        //audioElement.pause()
    }
    audioElement.play()
}





document.getElementById("start").onclick = (e) => {
    e.target.parentElement.remove()
    Main()
}

