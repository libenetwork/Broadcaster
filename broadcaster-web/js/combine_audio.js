let destination;
let contexts = [];
let audioContext;
function combineaudio(){
  
     audioContext = new AudioContext();
    
    audiostreams.forEach(stream => {
            contexts[contexts.length] = audioContext.createMediaStreamSource(stream);
    });
    destination = audioContext.createMediaStreamDestination();
    contexts.forEach(context => {
        context.connect(destination);
    })
    
}