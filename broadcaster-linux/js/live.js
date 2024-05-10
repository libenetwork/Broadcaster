let isLive = false; let active = false;
window.setInterval(checkstreams, 1000);
function checkstreams(){
    if(connected){
    if (!isLive){
        if (JSON.parse(JSON.parse(localStorage.getItem("broadcast")).servers).length > 0){
            if (!active){
            active = true;
            console.log("streams");
            document.querySelector('[data-action="goLive"]').classList.remove("inactive");
        }
        }else{
            active = false;
            document.querySelector('[data-action="goLive"]').classList.add("inactive");
        }
    }}else{
        active = false;
            document.querySelector('[data-action="goLive"]').classList.add("inactive");
    }
}
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-action="goLive"]').addEventListener('click', (e) => {
if (e.target.classList.contains("inactive") &&
(document.getElementsByClassName("live-indicator")[0].classList.contains(not-show))){}else{
    let living = false;
    
        if (!living){
            living = true; let countdown = 10;
            let indicator = document.getElementsByClassName("live-indicator")[0];

           const interval = setInterval(function () {
            indicator.classList.remove("not-show");

                  indicator.children[1].innerText = "Почнемо через " + countdown;
                  countdown--;
                  if (countdown === -1) {
                    clearInterval(interval);
                    indicator.children[1].innerText = "Live";
                    
                  }
            }, 1000);
        }
 
    /*
        let addres = "noname";
        let clients = [];
        const client = new WebSocket(
            "wss://broadcaster-uozh.onrender.com/" +
            '/rtmp/' +
            addres
        );
    
        client.addEventListener('open', (e) => {

            document.getElementById("live").innerText = "LIVE!";
            window.localStorage.setItem('status', "LIVE");
            console.log('WebSocket Open', e);
            let stream = document.querySelector('#video').captureStream(30);
            audiostreams.forEach(stream_tracks => stream_tracks.getTracks().forEach(track => stream.addTrack(track)));

            let mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: 3000000
            });

   
            mediaRecorder.start(1000);
            let recordedData = [];

            mediaRecorder.addEventListener('dataavailable', (e) => {
                console.log(e.data);
        
                 client.send(e.data);
            });


            mediaRecorder.addEventListener('stop', (e) => {
                client.close.bind(client);

            });
            function setVideoFromBlob(blob, fileInfo = {type: "video/mp4"},video) {
                // Older browsers may not have srcObject
                if ('srcObject' in video) {
                    try {
                        //fileInfo (type) required by safari, but not by chrome..
                        video.srcObject = new Blob([blob], fileInfo);
                    } catch (err) {
                        if (err.name != "TypeError") {
                            throw err;
                        }
                        // Even if they do, they may only support MediaStream
                        video.src = URL.createObjectURL(blob);
                    }
                } else {
                    video.src = URL.createObjectURL(blob);
                }
                video.setAttribute("controls", "controls");
                document.getElementsByClassName("videotest")[0].append(video);

            }


            client.addEventListener('close', (e) => {
                console.log('WebSocket Close', e);
                //    mediaRecorder.stop();
                window.localStorage.setItem("status", "offline");
            });


        });*/
    }
    });
});