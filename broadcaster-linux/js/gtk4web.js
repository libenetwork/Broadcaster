const ipc = require('electron').ipcRenderer
let token;
let webhookclient;
let webhook_uri;
// close app
function closeApp(e) {
    console.log("close");
    e.preventDefault()
    ipc.send('close')
}
console.log(document.getElementsByClassName("close").length)
document.getElementsByClassName("close")[0].addEventListener("click", closeApp);
ipc.on('maximize', function (e) {
console.log("max");
document.getElementsByClassName("gtk-window")[0].style = "border-radius:0";
    document.getElementsByClassName("gtkheader")[0].style = "border-radius:0";

});
ipc.on('return', function (e) {
    document.getElementsByClassName("gtk-window")[0].style = "border-radius:1em";
    document.getElementsByClassName("gtkheader")[0].style = "border-radius:1em 1em 0 0 ";
});
function open_donate_window(){
    ipc.send("open_donate");
}

ipc.on('cookie_token', (e,data) => {
    token = data;
    webhook_uri = 'https://broadcaster-uozh.onrender.com/webhook/' +
        token;
    webhookclient = new WebSocket(
        'wss://broadcaster-uozh.onrender.com/webhook/' +
        token
    );
    console.log(webhook_uri);
    webhookclient.addEventListener("open", e => {console.log("Was connected!")})

});

const welcome = document.getElementsByClassName("welcome")[0];
const start = document.getElementById("start");
const connect = document.getElementById("connect");
start.addEventListener("click", openintegrate);

function openintegrate(e){
    console.log("next");
    const first = anime({
        targets: welcome,
        translateX: '-100%',
        autoplay: false
    });
    const second = anime({
        targets: connect,
        left: '0',
        autoplay: false
    });
    first.play();
    second.play();

}