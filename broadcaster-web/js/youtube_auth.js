let youtubesocket;

if (location.href.split("https://broadcaster-uozh.onrender.com/")[1].startsWith("?code")){
    //alert(location.href.split("https://broadcaster-uozh.onrender.com/")[1]);
    console.log(location.href.split("https://broadcaster-uozh.onrender.com/")[1]);

    youtubesocket = new WebSocket(

        'wss://' + // http: => ws:, https: -> wss:
        "broadcaster-uozh.onrender.com" +
        '/youtube/auth'
    );     
    youtubesocket.addEventListener("open", e => {
        youtubesocket.send(location.href.split("https://broadcaster-uozh.onrender.com/")[1]);
        youtubesocket.addEventListener("message", e => {
            if (e.data.toString().startsWith("{\"tokens\":")){
                console.log(JSON.parse(e.data));
             //   alert(e.data);
            }
        })
    })   
   
}

document.getElementById("youtube").addEventListener("click", (e) =>
{
   console.log("youtube");
   youtube_authorise();
});
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
        //  ipc.send("window", e.data);
      /*    ipc.on('response', function (e, response) {
           //   console.log(response);
              youtubesocket.send(response);*/
              location.href = e.data;
          
          }
    });}


}