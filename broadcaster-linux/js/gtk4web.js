const ipc = require('electron').ipcRenderer

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
    document.getElementsByClassName("gtkheader")[0].style = "border-radius:1em";
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