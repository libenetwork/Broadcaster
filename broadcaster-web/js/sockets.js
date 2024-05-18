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
        url);  socket.addEventListener("error", (event) => {
            stop();
            console.log("WebSocket error: ", event);
          });
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
  
 
    function start_record(){
            record_stream = document.querySelector('#video').captureStream(30);
         //   audiostreams.forEach(stream_tracks => stream_tracks.getTracks().forEach(track => record_stream.addTrack(track)));
            combineaudio();
            record_stream.getAudioTracks().forEach((track) => {
                record_stream.removeTrack(track);
            });
            record_stream.addTrack(destination.stream.getAudioTracks()[0]);
            mediaRecorder = new MediaRecorder(record_stream, {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: 5 * 1000 * 1000
            });
            socket.addEventListener('close', (close) => {
                console.log('WebSocket Close', close);
                //    mediaRecorder.stop();
                    mediaRecorder.stop();
                    stop();
            });
   
            mediaRecorder.start(1000);
            mediaRecorder.addEventListener('dataavailable', (e) => {
                console.log(e.data);
                socket.send(e.data)
             
    })
    }

}