

function open_donate_window(){
   
    ipc.send("open_donate");
        
}

function open_broadcast_window(){
 
    ipc.send("open_broadcast");}
    

function open_cover(){
  
    ipc.send("open_cover");
        
}
wc.addEventListener("message", (e) => {
    console.log(e.data);
    switch (e.data){
    case "scene_opened":
    
        alert("Сцена вже відкрита");
        break;}

})
