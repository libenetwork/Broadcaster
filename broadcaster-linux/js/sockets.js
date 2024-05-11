let record_stream; let mediaRecorder; let socket;
function createsockets(){
    let servicies = JSON.parse(JSON.parse(localStorage.broadcast).servers);
    let servers = [];
    servicies.forEach(element => {
        if (element.rtmp !== "")
        servers[servers.length] = element.rtmp;
    });
    let i = 0;
    console.log(servers);

    let socket_connect = false;
    let url = JSON.stringify(servers);

        socket = new WebSocket(  "ws://localhost:3000" +"/rtmp/" + 
        url);
        socket.addEventListener("message", (e) => 
    {
        console.log(e.data);
    })
        socket.addEventListener("open", (open) => {
            console.log('WebSocket Open', open);
            if (!socket_connect){
                start_record();
            socket_connect = true;
            }
            
        });
        socket.addEventListener('close', (close) => {
            console.log('WebSocket Close', close);
            //    mediaRecorder.stop();
                mediaRecorder.stop();
                stop();
        });
 
    function start_record(){
            record_stream = document.querySelector('#video').captureStream(30);
            audiostreams.forEach(stream_tracks => stream_tracks.getTracks().forEach(track => record_stream.addTrack(track)));
            mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: 6 * 1000 * 1000
            });

   
            mediaRecorder.start(1000);
            mediaRecorder.addEventListener('dataavailable', (e) => {
                console.log(e.data);
                socket.send(e.data)
             
    })
    }

}