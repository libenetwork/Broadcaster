
document.getElementById("youtube").addEventListener("click", (e) =>
{
   console.log("youtube");
   youtube_authorise();
});
let youtubesocket;
function youtube_authorise() {
    let login;
    youtubesocket = new WebSocket(

        'ws://' + // http: => ws:, https: -> wss:
        "localhost:3000" +
        '/youtube/auth'
    );
    youtubesocket.addEventListener("message", e => {
        //Youtube_url = e.data;
        if (e.data.toString().startsWith("http://")) {
            ipc.send("window", e.data);
            ipc.on('response', function (e, response) {
                console.log(response);
                youtubesocket.send(response);

            });
        }else{
            console.log(e.data);
        }
    });

}