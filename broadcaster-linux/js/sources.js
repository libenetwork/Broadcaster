class source {
    constructor(name, device, volume) {
        this.name = name;
        this.device = device;
        this.volume = volume;
    }
}
let sources = [];
let audiostreams = [];

function add_source(id){
    console.log("ok!" + id);
           /* let append = "<td>" + document.getElementsByClassName("microphone")[0].innerText + "</td><td><input type=\"range\" id=\"volume" + (sources.length) + "\" name=\"volume\" min=\"0\" max=\"100\" value='100' /></td><td><div class=\"bar\"> <div class=\"indicator\" id=\"indicator"+ (sources.length) +"\"></div>\</div></td>";
            // document.getElementsByClassName("sources")[0].innerHTML += append;
            var newcontent = document.createElement("tr");
            newcontent.innerHTML = append;
            document.getElementsByClassName("sources")[0].append(newcontent);

            let added_source = new source(document.getElementsByClassName("microphone")[0].innerText, micro.find((e) => e.label === document.getElementsByClassName("microphone")[0].innerText), document.getElementById("volume" + sources.length).value);
            */

    let place_source = document.getElementById("source");
    if (document.getElementsByClassName("no-sources")[0].classList.contains("not-show") === false){
        document.getElementsByClassName("no-sources")[0].classList.add("not-show");
        place_source.classList.remove("not-show");

    }
    let container = document.createElement("div");
          //  create_stream(sources.length-1);
            let sound = document.createElement("div");
    let icon = document.createElement("img");
    icon.src = "symbols/microphone2-symbolic.svg";
    icon.classList.add("button_icon");
    sound.appendChild(icon);
    let text = document.createElement("div");
    text.innerText = document.getElementsByClassName("popr-item")[id].children[1].innerText;
    text.style.fontWeight = "300";
    sound.appendChild(text);
    container.classList.add('preferences-group-element');
    sound.classList.add('audio-source-tittle');
    container.appendChild(sound);
    let range = document.createElement("input");
    range.type = "range";
    range.name = "micro" + id;
    let i = place_source.childElementCount / 2;
    range.id = "volume" + i;
    range.min = "0";
    range.max = '100';
    range.classList.add("range_input");
    let indicator = document.createElement("div");
    indicator.classList.add("indicator_body");
    let progressbar = document.createElement("div");
    progressbar.classList.add("indicator");
    indicator.appendChild(progressbar);
    const tempSliderValue = range.value;
    const progress = (tempSliderValue / range.max) * 100;
    range.style.background = `linear-gradient(to right, #3584e4 ${progress}%,  #6d6d6dff ${progress}%)`;
    range.addEventListener("input", (event) => {
        const tempSliderValue = event.target.value;
        const progress = (tempSliderValue / range.max) * 100;
        range.style.background = `linear-gradient(to right, #3584e4 ${progress}%,  #6d6d6dff ${progress}%)`;
    })
    container.appendChild(range);
    place_source.appendChild(container);
    progressbar.id = "indicator" + i;
    place_source.appendChild(indicator);
    sources[sources.length] = new source(text.innerText, micro[id], document.getElementById("volume" + sources.length).value);
    create_stream(sources.length-1)
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
                if (peak * 100 > 60){
                    document.getElementById('indicator' + id).style.backgroundColor = "#1a5fb4";
                } if (peak * 100 > 85){
                    document.getElementById('indicator' + id).style.backgroundColor = "#8f1d25";
                }if (peak * 100 < 60)
                {
                    document.getElementById('indicator' + id).style.backgroundColor = "#3584e4";

                }
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
        document.getElementById('indicator' + id).style.width = `${peak * 100}%`;
        if (peak * 100 > 60){
            document.getElementById('indicator' + id).style.backgroundColor = "#1a5fb4";
        } if (peak * 100 > 85){
            document.getElementById('indicator' + id).style.backgroundColor = "#8f1d25";
        }if (peak * 100 < 60)
        {
            document.getElementById('indicator' + id).style.backgroundColor = "#3584e4";

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
