let isLive = false; let active = false; let first_socket= false;
window.setInterval(checkstreams, 1000);
let startbutt = document.querySelector('[data-action="goLive"]');
function makestopbutton(){
    startbutt.children[1].innerText = "Стоп!";
    startbutt.classList.remove("live-button");
    startbutt.children[0].src = "symbols/stop-small-symbolic.svg"
}
function makestartbutton(){
    startbutt.children[1].innerText = "Вийти в етер!";
    startbutt.classList.add("live-button");
    startbutt.children[0].src = "symbols/media-record-symbolic.svg";
}

 function stop(){
    makestartbutton();
    isLive = false;
    document.getElementsByClassName("live-indicator")[0].classList.add("not-show");
    try{
    socket.close();
    }catch{

    }

 }
function checkstreams(){
    if(connected){
    if (!isLive){
        if (JSON.parse(JSON.parse(localStorage.getItem("broadcast")).servers).length > 0){
            if (!active){
            active = true;
            console.log("streams");
            startbutt.classList.remove("inactive");
        }
        }else{
            active = false;
            startbutt.classList.add("inactive");
        }
    }else{
        makestopbutton();
    }}else{
        active = false;
            startbutt.classList.add("inactive");
            stop();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-action="goLive"]').addEventListener('click', (e) => {
        if (!isLive){
if (e.target.classList.contains("inactive")){}else{
    isLive = true;

    
    
          let countdown = 10;
            let indicator = document.getElementsByClassName("live-indicator")[0];

           const interval = setInterval(function () {
            if (isLive){
            indicator.classList.remove("not-show");
                  indicator.children[1].innerText = "Почнемо через " + countdown;
                  countdown--;
                  if (countdown === -1) {
                    clearInterval(interval);
                    indicator.children[1].innerText = "Live";
                    createsockets();
                    
                  }
                  }else{
                    clearInterval(interval);
                  }
            }, 1000);
        }

    }else{
        stop();
    }
    });
});