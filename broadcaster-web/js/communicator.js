const wc = new BroadcastChannel('windowchanel');
const bc = new BroadcastChannel('donatechanel');

wc.addEventListener("message", (e) => {
    switch (e.data){
        case "get_donates":
            wc.postMessage(JSON.stringify(donate));
            break;
   

    }
})
await function refresh_youtube(){
    let refresh_token = new WebSocket("wss://broadcaster-uozh.onrender.com/refresh/"  + localStorage.refresh_token);
    refresh_token.addEventListener("message", e => {
        console.log(JSON.parse(e.data));
        try{
        let new_token = JSON.parse(localStorage.youtube_token);
        new_token.tokens = JSON.parse(e.data);
        localStorage.setItem("youtube_token", JSON.stringify(new_token));
        }catch{
            localStorage.setItem("youtube_token", JSON.stringify(e.data));
        }
    })
}