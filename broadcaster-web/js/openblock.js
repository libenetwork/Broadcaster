
function open_window(link, width, height){
    
    let wrapper = document.getElementsByClassName("open_window")[0];
    wrapper.style.display = "flex";
    let frame = document.getElementById("window");
    frame.src = link;
    frame.style.height = height + "px";
    frame.style.width = width + "px";
  //  $('#window').load(link);

    anime({
        targets: wrapper,
        opacity: '100%',
        duration: 200
    })

}
function close_window(){
    let wrapper = document.getElementsByClassName("open_window")[0];
    let frame = document.getElementById("window");
    anime({
        targets: wrapper,
        opacity: '0%',
        duration: 200
    });
    frame.src = "";
    wrapper.style.display = "none";


}
function open_donate_window(){
   
    open_window("../donate.html", 400, 500)
        
}

function open_broadcast_window(){
 
    open_window("../broadcast_create.html", 500, 650)

}
    
    function open_chat_window(){
 
        open_window("../chat_window.html", 500,650)}
        


function open_cover(){
  
    document.getElementById("file").click();

        
}
function checkFileSize() {
    const FS = document.getElementById("file");
    const files = FS.files;
  
    // If there is (at least) one file selected
    if (files.length > 0) {
      if (files[0].size > 75 * 1024) {
        // Check the constraint
        alert("The selected file must not be larger than 75 kB");
        return;
      }
    }
    // No custom constraint violation
    FS.setCustomValidity("");
  }
wc.addEventListener("message", (e) => {
    console.log(e.data);
    switch (e.data){
    case "scene_opened":
    
        alert("Сцена вже відкрита");
        break;
    case "window_close":
        close_window();
        break; 
    }
})
try{
    const uploadField = document.getElementById("file");

    uploadField.onchange = function() {
        var image = new Image();
        let isok = true;
        if(this.files[0].size > 2097152) {
           alert("Ваш файл завеликий для трансляції. Стисніть його, або використайте інший.");
            isok = false;
        }
        let adress = URL.createObjectURL(this.files[0]);
        image.src = adress;
        image.onload = function(){
            if (image.naturalWidth > 640){
                if (isok){
                    let caption = document.getElementsByClassName("no-video");
            for (let i = 0; i < caption.length; i++){
                caption[i].classList.add("not-show");
            }
            let img = document.getElementById("cover");
            img.classList.remove("not-show");
            img.src = image.src;
                }
            }else{
                alert("Ширина вашого файлу мусить бути не менше 640 пікселів");
            }
        }
        
           
    } 
}catch{

}