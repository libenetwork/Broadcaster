let mediaRecorder;
const bc = new BroadcastChannel('mediachanel');

function setmedia(selector){

    mediaStream = document.querySelector(selector).captureStream(30); // 30 FPS
    mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=h264',

        videoBitsPerSecond : 3000000
    });
   // mediaRecorder.start(1000);

}
function getmedia(){
    return mediaRecorder;
}

