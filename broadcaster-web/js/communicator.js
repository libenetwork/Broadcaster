const wc = new BroadcastChannel('windowchanel');
const bc = new BroadcastChannel('donatechanel');

wc.addEventListener("message", (e) => {
    switch (e.data){
        case "get_donates":
            wc.postMessage(JSON.stringify(donate));
            break;
   

    }
})
function refresh_youtube(){
    let revoke_token = new WebSocket("wss://broadcaster-uozh.onrender.com/refresh/"  + localStorage.refresh_token);
    revoke_token.addEventListener("message", e => {
        console.log(JSON.parse(e.data));
        let new_token = JSON.parse(localStorage.youtube_token);
        new_token.tokens = JSON.parse(e.data);
        localStorage.setItem("youtube_token", JSON.stringify(new_token));
    })
}