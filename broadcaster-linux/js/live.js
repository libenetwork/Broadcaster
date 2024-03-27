
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-action="goLive"]').addEventListener('click', (e) => {


        let addres = "noname";
        if (url.value != "" || key.value != "")
            addres = url.value + "/" + key.value;
        alert("Broadcast was started at " + addres);

        const client = new WebSocket(
            window.location.protocol.replace('http', 'ws') + '//' + // http: => ws:, https: -> wss:
            window.location.host +
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

            // console.log(URL.createObjectURL(stream));
            // console.log(URL.createObjectURL(mixed_stream.getMixedStream()));

            //let mediaRecorder = new MediaStreamRecorder(mediastreams);
            /*   mediaRecorder.mimeType = 'video/webm';
               mediaRecorder.samplerate = 96000;*/
            mediaRecorder.start(1000);
            let recordedData = [];

            mediaRecorder.addEventListener('dataavailable', (e) => {
                console.log(e.data);
                //let video = document.createElement("video");
               // setVideoFromBlob(e.data, {type: "video/mp4"},video);

                //+
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


        });

    });
});