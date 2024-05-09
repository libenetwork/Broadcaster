const e = require("express");

class source {
    constructor(name, device, volume, position) {
        this.name = name;
        this.device = device;
        this.volume = volume;
        this.position = position;

    }
}
let sources = [];
let audiostreams = [];

function add_source(id, issys, stream){
    console.log("ok!" + id);
           /* let append = "<td>" + document.getElementsByClassName("microphone")[0].innerText + "</td><td><input type=\"range\" id=\"volume" + (sources.length) + "\" name=\"volume\" min=\"0\" max=\"100\" value='100' /></td><td><div class=\"bar\"> <div class=\"indicator\" id=\"indicator"+ (sources.length) +"\"></div>\</div></td>";
            // document.getElementsByClassName("sources")[0].innerHTML += append;
            var newcontent = document.createElement("tr");
            newcontent.innerHTML = append;
            document.getElementsByClassName("sources")[0].append(newcontent);

            let added_source = new source(document.getElementsByClassName("microphone")[0].innerText, micro.find((e) => e.label === document.getElementsByClassName("microphone")[0].innerText), document.getElementById("volume" + sources.length).value);
            */

    let place_source = document.getElementById("source");
    place_source.style.maxHeight = "100px";
    if (document.getElementsByClassName("no-sources")[0].classList.contains("not-show") === false){
        document.getElementsByClassName("no-sources")[0].classList.add("not-show");
        place_source.classList.remove("not-show");
    }
    let container = document.createElement("div");
          //  create_stream(sources.length-1);
    let sound = document.createElement("div");
    let icon = document.createElement("img");
    if (issys === undefined){
    icon.src = "symbols/microphone2-symbolic.svg";
    }else{
      icon.src =  "symbols/audio-volume-high-symbolic.svg";
    }
    icon.classList.add("button_icon");
    sound.appendChild(icon);
    let text = document.createElement("div");
    if (issys === undefined){
    text.innerText = document.getElementsByClassName("popr-item")[id].children[1].innerText;
    }else{
        text.innerText = "Захоплення пристрою";
    }
    text.style.fontWeight = "300";
    text.style.overflowX = "hidden";
    text.style.textOverflow = "ellipsis";
    sound.appendChild(text);
    container.classList.add('preferences-group-element');
    sound.classList.add('audio-source-tittle');
    container.appendChild(sound);
    let range = document.createElement("input");
    range.type = "range";
    if (issys === undefined){
    range.name = "micro" + id;
    }else {
        range.name = "system_volume"
    }
    let i = 0;
    try{
    i = Number(place_source.lastChild.children[0].id.split("indicator")[1]) + 1;
    }catch{

    }
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
        if (document.getElementsByClassName("back_cont")[Array.from(document.getElementsByClassName("back_cont")).findIndex((t) => 
        Number(t.parentNode.children[1].children[0].id.split("volume")[1]) === Number(event.target.id.split("volume")[1]))].children[1].classList.contains("mute"))
        {}else {

            const tempSliderValue = event.target.value;
        const progress = (tempSliderValue / range.max) * 100;
        range.style.background = `linear-gradient(to right, #3584e4 ${progress}%,  #6d6d6dff ${progress}%)`;
    }})
    let back_cont = document.createElement("div");
    back_cont.appendChild(range);
    let mute = document.createElement('img');
    mute.id = "mute" + i;
    mute.src = "symbols/microphone-sensitivity-muted-symbolic.svg";
    mute.classList.add("highlight_icon");
    back_cont.classList.add("back_cont");
    mute.addEventListener("click", (e) => {
        if (mute.classList.contains("mute")){
            mute.classList.remove("mute");
            mute.classList.add("highlight_icon");

        }else{
            mute.classList.add("mute");
            mute.classList.remove("highlight_icon");
        }
    });
    back_cont.appendChild(mute);
    let delete_source = document.createElement("img");
    delete_source.id = "trash" + i;
    delete_source.src = "symbols/user-trash-symbolic.svg";
    delete_source.classList.add("highlight_icon");
    delete_source.onclick = function (e) {
        remove_source(Number(e.target.parentElement.parentElement.children[1].children[0].id.split("volume")[1]));
    };
    back_cont.appendChild(delete_source);
    container.appendChild(back_cont);

    place_source.appendChild(container);
    progressbar.id = "indicator" + i;
    place_source.appendChild(indicator);
    sources[sources.length] = new source(text.innerText, micro[id], document.getElementById("volume" + i).value, i);
   
        if (issys !== undefined){
            create_streame_from_track(stream.getAudioTracks()[0], i);
        }else{
 
    create_stream(sources.length-1)}
}


function remove_source(id){
    remove_stream(id);
    document.getElementById("volume" + id).parentElement.parentElement.remove();
    document.getElementById("indicator" + id).parentElement.remove();
    try {
       sources = array_remove(sources, sources.findIndex((e) => e.position === id));
    }catch (e){
        console.log(e);
    }
    if (document.getElementById("source").childElementCount === 0){
        document.getElementById("source").classList.add("not-show");
        document.getElementsByClassName("no-sources")[0].classList.remove("not-show");
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
            let index = Number(document.getElementById("source").children[document.getElementById("source").
            children.length-1].children[0].id.split("indicator")[1]);
            gain.id = index;
            gain.gain.value = 0.5;
            gain.connect(destination);
            // destination.connect(analyzer);
            let muted = false; let save ;
            document.getElementById("mute" + sources[id].position).addEventListener("click", (e) => {

                if (e.target.classList.contains("mute")) {
                    muted = true;
                    gain.gain.value = 0;
                    document.getElementById('indicator' + e.target.id.split("mute")[1]).style.width = 0;
                    save = document.getElementById('volume' +  e.target.id.split("mute")[1]).value;
                    document.getElementById('volume' +  e.target.id.split("mute")[1]).value = 0;
                    document.getElementById('volume' +  e.target.id.split("mute")[1]).style.background ="#6d6d6dff";

                }else {muted = false;
                    document.getElementById('volume' +  e.target.id.split("mute")[1]).value = save;
                    gain.gain.value = Number(save) / 100; // Any number between 0 and 1.
                    document.getElementById('volume' +  e.target.id.split("mute")[1]).style.background = `linear-gradient(to right, #3584e4 ${save}%,  #6d6d6dff ${save}%)`;
                }
            });
            document.getElementById('volume' + sources[id].position).addEventListener("change", (e) => {
                if (muted){
                    gain.gain.value = 0;
                    e.target.value = 0;
                    e.target.style.backgroundColor ="#6d6d6dff";
                }else {
                    gain.gain.value = Number(e.target.value) / 100; // Any number between 0 and 1.
                }
            });
            gain.connect(analyzer);

            //source.connect(analyzer);

            // The array we will put sound wave data in
            const array = new Uint8Array(analyzer.fftSize);

            function getPeakLevel() {
                analyzer.getByteTimeDomainData(array);
                return array.reduce((max, current) => Math.max(max, Math.abs(current - 127)), 0) / 128;
            }
                let r = 0;
            let peakp;
            let skip = 3;
            function tick() {
                if (r === skip){
                const peak = getPeakLevel();
                try{
                let indicator =  document.getElementById("indicator" + gain.id)
                anime({
                    targets: indicator,
                    width: [`${peakp * 100}%`,`${peak * 100}%`],

                });
                if (peak * 100 > 60){
                    indicator.style.backgroundColor = "#1a5fb4";
                } if (peak * 100 > 85){
                    indicator.style.backgroundColor = "#8f1d25";
                }if (peak * 100 < 60)
                {
                   indicator.style.backgroundColor = "#3584e4";
                }
            }catch{

            }
                console.log(gain.id);
                r = 0;

                peakp = peak;
            }
                else{
                    r++;
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
    let muted = false; let save ;
    document.getElementsByClassName("back_cont")[id].children[1].onclick = function (){
        if (document.getElementsByClassName("back_cont")[id].children[1].classList.contains("mute")) {
            muted = true;
            gain.gain.value = 0;
            document.getElementById("indicator" + id).style.width = 0;
            save = document.getElementById('volume' + id).value;
            document.getElementById('volume' + id).value = 0;
            document.getElementById('volume' + id).style.background ="#6d6d6dff";

        }else {muted = false;
        document.getElementById('volume' + id).value = save;
            gain.gain.value = Number(save) / 100; // Any number between 0 and 1.
            document.getElementById('volume' + id).style.background = `linear-gradient(to right, #3584e4 ${save}%,  #6d6d6dff ${save}%)`;
        }
        }
     document.getElementById('volume' + id).onchange = function () {
        if (muted){
            gain.gain.value = 0;
            document.getElementById('volume' + id).value = 0;
            document.getElementById('volume' + id).style.backgroundColor ="#6d6d6dff";
        }else {
            gain.gain.value = Number(this.value) / 100; // Any number between 0 and 1.
        }
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
    let r = 0;
    let peakp; const skip = 3;
    function tick() {
        if (r === skip){
            try{
            const peak = getPeakLevel();
            let indicator =  document.getElementById('indicator' + id);
            anime({
                targets: indicator,
                width: [`${peakp * 100}%`,`${peak * 100}%`],

            });
            if (peak * 100 > 60){
                indicator.style.backgroundColor = "#1a5fb4";
            } if (peak * 100 > 85){
                indicator.style.backgroundColor = "#8f1d25";
            }if (peak * 100 < 60)
            {
                indicator.style.backgroundColor = "#3584e4";
            }
            r = 0;
            peakp = peak;}catch{

            }}
        else{
            r++;
        }

        requestAnimationFrame(tick);
    }

    tick();

    audiostreams[audiostreams.length] = destination.stream;

}
function remove_stream(id){
    try {
        audiostreams[id].getTracks().forEach(element => {
            audiostreams[id].removeTrack(element);
        });
        audiostreams = array_remove(audiostreams, id)
    //    audiostreams.splice(id, 1);
        //remove_audio_stream(id);
    }catch (e){

    }
}
