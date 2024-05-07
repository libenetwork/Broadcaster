const videoElem = document.getElementById("video");
const stopElem = document.getElementById("stop");
const url = document.getElementById("url");
const key = document.getElementById("key");

var displayMediaOptions = {
    video: {
        cursor: "always",
        height: 2000,
        width: 2000
    },
    audio: false
};
stopElem.addEventListener("click", function (e) {
    stopCapture();
}, false);
async function startCapture() {
    try {
        videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);


        dumpOptionsInfo();
    } catch (err) {
        console.error("Error: " + err);
    }
}

function stopCapture(e) {
    let tracks = videoElem.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;
}
function dumpOptionsInfo() {
    const videoTrack = videoElem.srcObject.getVideoTracks()[0];
    console.info("Track settings:");
    console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
    console.info("Track constraints:");
    console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}
