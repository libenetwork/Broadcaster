const ipc = require('electron').ipcRenderer
let token;
let webhookclient;
let donate = [];
let broadcast_creating = false;

// close app
function closeApp(e) {
    if (!broadcast_creating){
    try{
        save();
    }catch(e){

    }
    console.log("close");
    e.preventDefault()
    ipc.send('closewindow')
}
}



console.log(document.getElementsByClassName("close").length)
document.getElementsByClassName("close")[0].addEventListener("click", closeApp);
ipc.on('maximize', function (e) {
console.log("max");
document.getElementsByClassName("gtk-window")[0].style = "border-radius:0";
    document.getElementsByClassName("gtkheader")[0].style = "border-radius:0";

});

ipc.on("scene_opened", function(e){
    alert("Cцена вже відкрита!");
})
ipc.on("cover_file", function(e, args) {
    wc.postMessage("file:" + args);
})
ipc.on('return', function (e) {
    document.getElementsByClassName("gtk-window")[0].style = "border-radius:1em";
    document.getElementsByClassName("gtkheader")[0].style = "border-radius:1em 1em 0 0 ";
});
const welcome = document.getElementsByClassName("welcome")[0];
const start = document.getElementById("start");
const connect = document.getElementById("connect");
try {
    start.addEventListener("click", openintegrate);
}catch (e){
    console.log(e);
}

function openintegrate(e){
    const first = anime({
        targets: welcome,
        opacity: '-100%',
        autoplay: false,
        duration: 3000
    });
    const second = anime({
        targets: connect,
        opacity: '100%',
        autoplay: false
    });
    first.play();
    connect.style.display = "flex";
    second.play();

}
Array.from(document.querySelectorAll("input[type=text]")).forEach((e) => {
    e.addEventListener("focus", (x) => {
      
        if ((hasParents(e, document.getElementsByClassName("time")[0])) || (hasParents(e, document.getElementsByClassName("time")[1]))){
            getParents(e)[2].setAttribute("style", " border: 3px solid #677a93ff !important")
        }
         else if  ((Array.from(e.parentElement.parentElement.parentElement.children).findIndex((x) => x === e.parentElement.parentElement) === 0) && (Array.from(e.parentElement.parentElement.parentElement.parentElement.children).length !=   1) && (!e.parentElement.parentElement.parentElement.parentElement.children[0].classList.contains("video-container") )){
            e.parentElement.parentElement.setAttribute("style", "border-radius: 1em 1em 0 0; border: 3px solid #677a93ff !important");
        }else if  ((Array.from(e.parentElement.parentElement.parentElement.children).findIndex((x) => x === e.parentElement.parentElement) === Array.from(e.parentElement.parentElement.parentElement.children).length-1) && (Array.from(e.parentElement.parentElement.parentElement.parentElement.children).length !=   1) && (!e.parentElement.parentElement.parentElement.parentElement.children[0].classList.contains("video-container") ))
        {
            e.parentElement.parentElement.setAttribute("style", "border-radius: 0 0 1em 1em; border: 3px solid #677a93ff !important");
        }else{
            e.parentElement.parentElement.setAttribute("style", " border: 3px solid #677a93ff !important");

        }
    })
    e.addEventListener("focusout", (x) => {
        if ((hasParents(e, document.getElementsByClassName("time")[0])) || (hasParents(e, document.getElementsByClassName("time")[1]))){
            getParents(e)[2].setAttribute("style", " ")
        }
        else if (e.parentElement.parentElement.parentElement.parentElement.children[0].classList.contains("video-container")){
            e.parentElement.parentElement.setAttribute("style", "border: 0 !important; ");

        }else if(e.parentElement.parentElement.classList.contains("calendar"))
        {
            e.parentElement.parentElement.setAttribute("style", "border: 0 !important; border-radius: 0.5em !important");

        } else{
        e.parentElement.parentElement.setAttribute("style", "border: 0 !important; border-radius: 0 !important");
        }
    })
})

Array.from(document.querySelectorAll("textarea")).forEach((e) => {
    e.addEventListener("focus", (x) => {
         e.parentElement.parentElement.setAttribute("style", " border: 3px solid #677a93ff !important; ");
         
    })
    e.addEventListener("focusout", (x) => {
        e.parentElement.parentElement.setAttribute("style", "border: ");

    })
})
let calendar_focused = false;
Array.from(document.querySelectorAll("input[type=date]")).forEach((e) => {
    e.addEventListener("focus", (x) => {
         e.parentElement.parentElement.setAttribute("style", " border: 3px solid #677a93ff !important; width: 40%");
         calendar_focused = true;
         
    })
    e.addEventListener("focusout", (x) => {
        e.parentElement.parentElement.setAttribute("style", "width: 40% ");
        calendar_focused = false;

    })
})
Array.from(document.getElementsByClassName("plus")).forEach((elem) => {
    elem.addEventListener("click", (e) => {
        let new_value = getParents(elem)[0].children[0].children[0].children[0].value;
        let max_offset;
        switch (getParents(elem)[0].children[0].children[0].children[0].id){
            case "hours":
               max_offset = 23;
                break;
                case "minutes":
                    max_offset = 59;
                    break;
        }
        if (new_value < max_offset){
            new_value++;
        }else{ 
            new_value = 0;
        }
        getParents(elem)[0].children[0].children[0].children[0].value = new_value;
        
        
    });});
    Array.from(document.getElementsByClassName("minus")).forEach((elem) => {
        elem.addEventListener("click", (e) => {
            let new_value = getParents(elem)[0].children[0].children[0].children[0].value;
            let max_offset;
            switch (getParents(elem)[0].children[0].children[0].children[0].id){
                case "hours":
                   max_offset = 23;
                    break;
                    case "minutes":
                        max_offset = 59;
                        break;
            }
            if (new_value < max_offset){
                new_value--;
            }else{ 
                new_value = 0;
            }
            if (new_value < 0){
                new_value = 0;
            }
            getParents(elem)[0].children[0].children[0].children[0].value = new_value;
            
            
        });
});
