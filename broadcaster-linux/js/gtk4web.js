const ipc = require('electron').ipcRenderer
let token;
let webhookclient;
let donate = [];

// close app
function closeApp(e) {
    console.log("close");
    e.preventDefault()
    ipc.send('closewindow')
}
console.log(document.getElementsByClassName("close").length)
document.getElementsByClassName("close")[0].addEventListener("click", closeApp);
ipc.on('maximize', function (e) {
console.log("max");
document.getElementsByClassName("gtk-window")[0].style = "border-radius:0";
    document.getElementsByClassName("gtkheader")[0].style = "border-radius:0";

});
ipc.on("cover_file", function(e, args) {
    wc.postMessage("file:" + args);
})
ipc.on('return', function (e) {
    document.getElementsByClassName("gtk-window")[0].style = "border-radius:1em";
    document.getElementsByClassName("gtkheader")[0].style = "border-radius:1em 1em 0 0 ";
});
function open_donate_window(){
    ipc.send("open_donate");
}
function open_broadcast_window(){
    ipc.send("open_broadcast");
}
function open_cover(){
    ipc.send("open_cover");
}


const welcome = document.getElementsByClassName("welcome")[0];
const start = document.getElementById("start");
const connect = document.getElementById("connect");
try {
    start.addEventListener("click", openintegrate);
}catch (e){
    console.log(e);
}

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