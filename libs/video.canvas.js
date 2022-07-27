var video = document.createElement('video');
video.setAttribute('playsinline', '');
video.setAttribute('autoplay', '');
video.setAttribute('muted', '');
video.style.width = '200px';
video.style.height = '200px';

/* Setting up the constraint */
var facingMode = "user"; // Can be 'user' or 'environment' to access back or front camera (NEAT!)
var constraints = {
  audio: false,
  video: {
   facingMode: facingMode
  }
};

// const streamer = {}

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
        video: true
    })
    .then(function (stream) {
        video.srcObject = stream;
    })
    .catch(function (err) {
        warn('video error', err)
        alert('allow video')
        exitting()
    });
}


// streamer.prototype.stop = function(e) {
//     var stream = video.srcObject;
//     var tracks = stream.getTracks();
  
//     for (var i = 0; i < tracks.length; i++) {
//       var track = tracks[i];
//       track.stop();
//     }
  
//     video.srcObject = null;
// }





