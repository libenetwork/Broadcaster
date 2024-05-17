const wc = new BroadcastChannel('windowchanel');
const bc = new BroadcastChannel('donatechanel');

wc.addEventListener("message", (e) => {
    switch (e.data){
        case "get_donates":
            wc.postMessage(JSON.stringify(donate));
            break;
   

    }
})
function revoke_youtube(){
    let revoke_token = new WebSocket("wss://broadcaster-uozh.onrender.com/revoke_youtube/"  + JSON.parse(localStorage.youtube_token).tokens.refresh_token);
    revoke_token.addEventListener("message", e => {
        console.log(JSON.parse(e.data));
    })
}