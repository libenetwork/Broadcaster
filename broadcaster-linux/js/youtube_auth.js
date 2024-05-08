
document.getElementById("youtube").addEventListener("click", (e) =>
{
   console.log("youtube");
   youtube_authorise();
});
let youtubesocket;
let authostarted = false;
function youtube_authorise() {
    if (authostarted === false){
        authostarted = true;
    let login;
    youtubesocket = new WebSocket(

        'wss://' + // http: => ws:, https: -> wss:
        "broadcaster-uozh.onrender.com" +
        '/youtube/auth'
    );
    youtubesocket.addEventListener("message", e => {
        //Youtube_url = e.data;
       // console.log("yes");
        if (e.data.toString().startsWith("http")) {
            ipc.send("window", e.data);
            ipc.on('response', function (e, response) {
             //   console.log(response);
                youtubesocket.send(response);

            });
        }else if (e.data.toString().startsWith("{\"tokens\":")){
            console.log(e.data);
            localStorage.setItem("youtube_token", e.data);

            ipc.send("mainwindow");
            ipc.send("closewindow");
        }
    });}

}