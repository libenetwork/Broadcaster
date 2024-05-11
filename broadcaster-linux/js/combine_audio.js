let destination;
function combineaudio(){
  
    const audioContext = new AudioContext();
    let contexts = [];
    audiostreams.forEach(stream => {
            contexts[contexts.length] = audioContext.createMediaStreamSource(stream);
    });
    destination = audioContext.createMediaStreamDestination();
    contexts.forEach(context => {
        context.connect(destination);
    })
    
}