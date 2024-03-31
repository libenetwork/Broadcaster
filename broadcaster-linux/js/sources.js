class source {
    constructor(name, device, volume) {
        this.name = name;
        this.device = device;
        this.volume = volume;
    }
}
let sources = [];
let audiostreams = [];

function add_source(){
    if (document.getElementsByClassName("microphone")[0].innerText !== "Додати пристрій"){
        if (sources.find((e) => e.name === document.getElementsByClassName("microphone")[0].innerText) === undefined) {
            let append = "<td>" + document.getElementsByClassName("microphone")[0].innerText + "</td><td><input type=\"range\" id=\"volume" + (sources.length) + "\" name=\"volume\" min=\"0\" max=\"100\" value='100' /></td><td><div class=\"bar\"> <div class=\"indicator\" id=\"indicator"+ (sources.length) +"\"></div>\</div></td>";
            // document.getElementsByClassName("sources")[0].innerHTML += append;
            var newcontent = document.createElement("tr");
            newcontent.innerHTML = append;
            document.getElementsByClassName("sources")[0].append(newcontent);

            let added_source = new source(document.getElementsByClassName("microphone")[0].innerText, micro.find((e) => e.label === document.getElementsByClassName("microphone")[0].innerText), document.getElementById("volume" + sources.length).value);
            sources[sources.length] = added_source;
            create_stream(sources.length-1);
        }
    }

}
function remove_source(){
    if (document.getElementsByClassName("microphone")[0].innerText != "Додати пристрій"){
        try {
            remove_stream(sources.findIndex((e) => e.name === document.getElementsByClassName("microphone")[0].innerText));
            sources.splice(sources.findIndex((e) => e.name === document.getElementsByClassName("microphone")[0].innerText),1);
            Array.prototype.slice.call(document.getElementsByClassName("sources")[0].children).find((e) =>
                e.getElementsByTagName("td")[0].innerText === document.getElementsByClassName("microphone")[0].innerText).remove();

        }catch (e){

        }
    }
}
function create_stream(id){
    // sources[id].device.getUserMedia({});


        const constraints = {deviceId: {exact: sources[id].device.deviceId}};
        navigator.mediaDevices.getUserMedia({
            audio: constraints
        }).then((stream) => {
            const context = new AudioContext();
            const source = context.createMediaStreamSource(stream);
            const analyzer = context.createAnalyser();
            const destination = context.createMediaStreamDestination();
            const gain = context.createGain();
            source.connect(gain);
            gain.connect(destination);
            // destination.connect(analyzer);
            document.getElementById('volume' + id).onchange = function () {

                    gain.gain.value = Number(this.value)/100;


            };

                    gain.gain.value = Number(document.getElementById('volume' + id).value) / 100;
            
            gain.connect(analyzer);

            //source.connect(analyzer);

            // The array we will put sound wave data in
            const array = new Uint8Array(analyzer.fftSize);

            function getPeakLevel() {
                analyzer.getByteTimeDomainData(array);
                return array.reduce((max, current) => Math.max(max, Math.abs(current - 127)), 0) / 128;
            }

            function tick() {
                const peak = getPeakLevel();
                document.getElementById('indicator' + id).style.width = `${peak * 100}%`;
                requestAnimationFrame(tick);
            }

            tick();
            audiostreams[audiostreams.length] = destination.stream;
        });

}
function create_streame_from_track(track, id){
    const context = new AudioContext();
    const stream = new MediaStream;
    stream.addTrack(track);
    const source = context.createMediaStreamSource(stream);
    const analyzer = context.createAnalyser();
    const destination = context.createMediaStreamDestination();
    const gain = context.createGain();
    source.connect(gain);
    gain.connect(destination);
    // destination.connect(analyzer);
    document.getElementById('volume' + id).onchange = function () {

        gain.gain.value = Number(this.value) / 100; // Any number between 0 and 1.
    };
    gain.gain.value = Number(document.getElementById('volume' + id).value) / 100;
    gain.connect(analyzer);

    //source.connect(analyzer);

    // The array we will put sound wave data in
    const array = new Uint8Array(analyzer.fftSize);

    function getPeakLevel() {
        analyzer.getByteTimeDomainData(array);
        return array.reduce((max, current) => Math.max(max, Math.abs(current - 127)), 0) / 128;
    }

    function tick() {
        const peak = getPeakLevel();
        document.getElementById('indicator' + id).style.width = `${peak * 100}%`;
        if (peak * 100 > 60){
            document.getElementById('indicator' + id).style.backgroundColor = "#1a5fb4";
        }else if (peak * 100 > 85){
            document.getElementById('indicator' + id).style.backgroundColor = "#8f1d25";
        }
        requestAnimationFrame(tick);
    }

    tick();

    audiostreams[audiostreams.length] = destination.stream;

}
function remove_stream(id){
    try {
        audiostreams.splice(id, 1);
    }catch (e){

    }
}
