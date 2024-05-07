const wc = new BroadcastChannel('windowchanel');
const bc = new BroadcastChannel('donatechanel');

wc.addEventListener("message", (e) => {
    switch (e.data){
        case "get_donates":
            wc.postMessage(JSON.stringify(donate));
            break;
   

    }
})