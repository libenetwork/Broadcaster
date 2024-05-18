function em2px(em) {
    return Number(em) * Number(window.getComputedStyle(document.body).getPropertyValue('font-size').match(/\d+/)[0]);
}
let connected = false;
onresize = (e) => {
    let elem = document.getElementById("source");

    elem.style.maxHeight = window.innerHeight - elem.offsetTop - em2px(1) + "px";

};
let stream;
wc.addEventListener("message", (e) =>
{
    makestream(e.data)});
    async function makestream(data){

    switch (data){
       
     
        case "connected":
            alert("Поширте вікно створенної сцени");
           
          //  ipc.send("get-frame");
            
                if (!connected){
                try {
                    connected = true;
                    stream = await navigator.mediaDevices.getDisplayMedia({
                        video: {
                            cursor: "always",
                            height: 1920,
                            width: 1080
                        },
                        audio: true,
                        systemAudio: "include",

                    });
                    stream.addEventListener("stop", (event) => {
                        document.getElementById("video").classList.add("not-show");
                        let delete_elem = document.getElementsByClassName("no-video");
                        for (let i = 0; i < delete_elem.length; i++){
                            delete_elem[i].style.display = "flex";
                        }
                    });
       /*           stream = await navigator.mediaDevices.getUserMedia({
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
                    });*/

                    let delete_elem = document.getElementsByClassName("no-video");
                    for (let i = 0; i < delete_elem.length; i++){
                        delete_elem[i].style.display = "none";
                    }
                    let container = document.createElement("div");
                    document.getElementById("video").classList.remove("not-show");
                    document.getElementById("video").srcObject = stream;
               
                        if (stream.getAudioTracks().length !== 0){
                            document.getElementsByClassName("no-sources")[0].classList.add("not-show");
                            document.getElementById("source").classList.remove("not-show");        
                            add_source(-1, true, stream);
                        }
                    
                    

                    // wc.postMessage("connected")
                }catch (e){
                    console.log(e);
                }

            }

            
            break;
    }
}