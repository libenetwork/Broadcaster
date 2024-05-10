function em2px(em) {
    return Number(em) * Number(window.getComputedStyle(document.body).getPropertyValue('font-size').match(/\d+/)[0]);
}
let connected = false;
onresize = (e) => {
    let elem = document.getElementById("source");

    elem.style.maxHeight = window.innerHeight - elem.offsetTop - em2px(1) + "px";

};
let stream;
ipc.on("scene_destroyed", function(e){
    connected = false;
    let delete_elem = document.getElementsByClassName("no-video");
    for (let i = 0; i < delete_elem.length; i++){
        delete_elem[i].style.display = "block";


    }

    document.getElementById("video").classList.add("not-show");
    try{
        let index = Array.from(document.getElementsByClassName("audio-source-tittle")).findIndex((x) => x.children[1].innerText === "Захоплення пристрою");
        remove_source(index);
        stream.getTracks().forEach(element => {
            element.stop();
        });
     
}

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
                if (!connected){
                try {
                    connected = true;

                  stream = await navigator.mediaDevices.getUserMedia({
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
                    document.getElementById("source").classList.remove("not-show");
                    add_source(-1, true, stream);

                    // wc.postMessage("connected")
                }catch (e){
                    console.log(e);
                }

            }

            });
            break;
    }
});