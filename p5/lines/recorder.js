let recording = false;
let recorder;
let chunks = [];
let recordedFrames = 0
let recordAmount = 50


function record(fr) {
    chunks.length = 0;

    const stream = document.querySelector('canvas').captureStream(fr);
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = e => {
        if (e.data.size) chunks.push(e.data);
    };
    recorder.onstop = exportVideo;
}

function exportVideo(e) {
    const blob = new Blob(chunks, {
        'type': 'video/webm'
    });

    // Draw video to screen
    var videoElement = document.createElement('video');
    videoElement.setAttribute("id", Date.now());
    videoElement.controls = true;
    //document.body.appendChild(videoElement);
    videoElement.src = window.URL.createObjectURL(blob);

    // Download the video 
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'newVid.webm';
    a.click();
    window.URL.revokeObjectURL(url);

}

function checkRecording() {
    if(!recorder) return
    if(recordedFrames >= recordAmount) {
        recorder.stop();
        console.log("recording stopped!");
        return true
    }
    recordedFrames++
    console.log("frame:", recordedFrames, "/", recordAmount)
    return false
}

function initRecording(frames=30) {
    const res = window.confirm('start recording?')
    if(res) {
        console.info('ready for recording')
        frameRate(frames);
        record();
        recorder.start();
    } else {
        console.info('recording canceled')
    } 
}


/*
=> !! IMPLEMENTATION !!

function setup() {
    ...
    initRecording()
    ...
}

function draw() {
    ...
    checkRecording()
    ...
}


*/