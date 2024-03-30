let scene = document.getElementById("open_scene");
let opened = false;
scene.addEventListener("click", (e) => {
    if (opened === false){

   ipc.send("open_scene");
    opened = true;}
    else{
        alert ("Сцена вже відкрита");
    }
  // ipc.send("open_scene");
});