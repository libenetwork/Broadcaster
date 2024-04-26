let scene = document.getElementById("open_scene");

scene.addEventListener("click", (e) => {


   ipc.send("open_scene");
  
  // ipc.send("open_scene");
});
