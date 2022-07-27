const GatherAudio = (MAIN = () => "") => {
    const audioElement = document.getElementById("audio_01") || {};
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

    audioElement.onplay = () => {
        pause = false
        audioCtx.resume();
        animate();
    }
    audioElement.onpause = () => {
        pause = true
    }
    async function animate() {
        analyser.getByteFrequencyData(data);

        /** INSET FUNCTION HERE */
        MAIN( data.slice(0, 100) )

        if (pause) {
            audioElement.pause()
        }
        await pauseHalt()
        requestAnimationFrame(animate);
        //audioElement.pause()
    }

}

document.getElementById("start").onclick = (e) => {
    e.target.parentElement.remove()
    document.getElementById("audio_01").play()
}

function audioStart() {
    document.getElementById("start").click()
}

window.onerror =()=>document.getElementById("audio_01").pause()
