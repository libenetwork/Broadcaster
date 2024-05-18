let scene = document.getElementById("open_scene");
try{
scene.addEventListener("click", (e) => {


  // ipc.send("open_scene");
  
  window.open('../video.html', '_blank', 'toolbar=0,location=0,menubar=0');

  
  // ipc.send("open_scene");
});
}catch{
  
}