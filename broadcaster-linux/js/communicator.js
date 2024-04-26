const wc = new BroadcastChannel('windowchanel');
const bc = new BroadcastChannel('donatechanel');

wc.addEventListener("message", (e) => {
    switch (e.data){
        case "get_donates":
            wc.postMessage(JSON.stringify(donate));
            break;
        case "scene_opened":
            alert("Сцена вже відкрита");
            break;
            

    }
    console.log()
})