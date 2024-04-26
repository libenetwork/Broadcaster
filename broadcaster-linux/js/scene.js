function em2px(em) {
    return Number(em) * Number(window.getComputedStyle(document.body).getPropertyValue('font-size').match(/\d+/)[0]);
}
onresize = (e) => {
    let elem = document.getElementById("source");

    elem.style.maxHeight = window.innerHeight - elem.offsetTop - em2px(1) + "px";

};
ipc.on("scene_destroyed", function(e){
    let delete_elem = document.getElementsByClassName("no-video");
    for (let i = 0; i < delete_elem.length; i++){
        delete_elem[i].style.display = "block";

    }
    document.getElementById("video").classList.add("not-show");
    try{
    remove_source(Array.from(document.getElementsByClassName("audio-source-tittle")).findIndex((x) => x.children[1].innerText === "Захоплення пристрою"));}
    catch(e){

    }
})
wc.addEventListener("message", (e) =>
{
    console.log(e.data);
    switch (e.data){
       
     
        case "connected":
            alert("Поширте вікно створенної сцени");

            ipc.send("get-frame");
            ipc.on("frame_id", async (e, source) => {
                try {

                    let stream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            mandatory: {
                                chromeMediaSource: 'desktop'
                            }
                        },
                        video: {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: source,


                            }
                        }
                    });
                    let delete_elem = document.getElementsByClassName("no-video");
                    for (let i = 0; i < delete_elem.length; i++){
                        delete_elem[i].style.display = "none";
                    }
                    let container = document.createElement("div");
                    document.getElementById("video").classList.remove("not-show");
                    document.getElementById("video").srcObject = stream;
                    document.getElementsByClassName("no-sources")[0].classList.add("not-show");
                    let system_sound = document.createElement("div");
                    let system_icon = document.createElement("img");
                    system_icon.src = "symbols/audio-volume-high-symbolic.svg";
                    system_icon.classList.add("button_icon");
                    system_sound.appendChild(system_icon);
                    let place_source = document.getElementsByClassName("audio_sources")[1];
                    place_source.classList.remove("not-show");
                    let system_text = document.createElement("div");
                    system_text.innerText = "Захоплення пристрою";
                    system_text.style.fontWeight = "300";
                    system_sound.appendChild(system_text);
                    container.classList.add('preferences-group-element');
                    system_sound.classList.add('audio-source-tittle');


                    container.appendChild(system_sound);
                    // place_source.appendChild(system_sound);
                    let elem = document.getElementById("source");
                    (function(timer) {


                        elem.addEventListener('scroll', function(e) {

                            elem.classList.remove('no-scrollbar');
                            elem.classList.add('scrollbar');

                            clearTimeout(timer);
                            timer = setTimeout(function() {
                                elem.classList.add('no-scrollbar');
                                elem.classList.remove('scrollbar');
                            }, 100);

                        })

                    })();
                    elem.style.maxHeight = window.innerHeight - elem.offsetTop - em2px(1) + "px";
                    let system_range = document.createElement("input");
                    system_range.type = "range";
                    system_range.name = "system_volume";
                    let id = place_source.childElementCount / 2;
                    system_range.id = "volume" + id;
                    system_range.min = "0";
                    system_range.max = '100';
                    system_range.classList.add("range_input");
                    let system_indicator = document.createElement("div");
                    system_indicator.classList.add("indicator_body");
                    let system_progress = document.createElement("div");
                    system_progress.classList.add("indicator");
                    system_indicator.appendChild(system_progress);
                    const tempSliderValue = system_range.value;
                    const progress = (tempSliderValue / system_range.max) * 100;
                    system_range.style.background = `linear-gradient(to right, #3584e4 ${progress}%,  #6d6d6dff ${progress}%)`;
                    system_range.addEventListener("input", (event) => {
                        if (document.getElementsByClassName("back_cont")[Number(event.target.id.split("volume")[1])].children[1].classList.contains("mute")){}else {
                            const tempSliderValue = event.target.value;
                            const progress = (tempSliderValue / system_range.max) * 100;
                            system_range.style.background = `linear-gradient(to right, #3584e4 ${progress}%,  #6d6d6dff ${progress}%)`;
                        } });
                    let back_cont = document.createElement("div");
                    back_cont.appendChild(system_range);
                    let mute = document.createElement('img');
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
                    delete_source.src = "symbols/user-trash-symbolic.svg";
                    delete_source.classList.add("highlight_icon");
                    delete_source.onclick = function () {
                        remove_source(id);
                    };
                    back_cont.appendChild(delete_source);
                    container.appendChild(back_cont);
                    place_source.appendChild(container);
                    system_progress.id = "indicator" + id;
                    place_source.appendChild(system_indicator);
                    create_streame_from_track(stream.getAudioTracks()[0], id);


                    // wc.postMessage("connected")
                }catch (e){
                    console.log(e);
                }



            });
            break;
    }
});