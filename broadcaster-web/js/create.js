
const categorysnippet = [1, 2,10,15,17, 19,20,  22, 23, 24, 25, 26,27, 28]
let actualcategory = 1;
    class broadcast{
      
    constructor(name, cover, description, acces, category, forkids, servers, date, time) {
        this.name = name;
        this.cover = cover
        this.description = description;
        this.acces = acces;
        this.category = category;
        this.forkids = forkids;
        this.servers = servers;
        this.date = date;
        this.time = time;

    }

}
class youtube{
    
}
class server{
        constructor(service, rtmp, id, chat){
                this.service = service;
                this.rtmp = rtmp;
                this.id = id;
                this.chat = chat;
      
      
        }
      
    }
    function checkdate(obj){
        if ((obj.date !== undefined) && (obj.date !== "") && (obj.time !== undefined) && (obj.time !== "") ){
            let hours = obj.time.split(":")[0]; let minutes = obj.time.split(":")[1];
          
            if (new Date(obj.date + " " + hours + ":" + minutes).getTime() > Date.now()){
        document.getElementById("date").valueAsDate = new Date(obj.date);
        afterdate = obj.date;
        aftertimestamp = getTimestampfromday(obj.date);
        if (obj.time.split(":")[0][0] === "0"){
        document.getElementById("hours").value = obj.time.split(":")[0][1];}
            else{
                document.getElementById("hours").value = obj.time.split(":")[0];
            }
            if (obj.time.split(":")[1][0] === "0"){
                document.getElementById("minutes").value = obj.time.split(":")[1][1];}
                    else{
                        document.getElementById("minutes").value = obj.time.split(":")[1];
                    }

        }
        else{
            document.querySelector("#date").valueAsDate = new Date();
            document.getElementById("hours").value = new Date().getHours();
            document.getElementById("minutes").value = new Date().getMinutes();

        }}else{
            document.querySelector("#date").valueAsDate = new Date();
            document.getElementById("hours").value = new Date().getHours();
            document.getElementById("minutes").value = new Date().getMinutes();

        }
    }
let servers = [];
    let servercounts = 0;

    document.getElementsByClassName("close")[0].addEventListener("click", save);
   window.onload = restore();
   function addImage(obj){
    if (( obj.cover !== undefined) && (obj.cover !== "")){
        let caption = document.getElementsByClassName("no-video");
        
for (let i = 0; i < caption.length; i++){
    caption[i].classList.add("not-show");
}
let image = document.getElementById("cover");
image.classList.remove("not-show");
image.src = obj.cover;}
   }
    function restore(){
        
        try{
            let obj = JSON.parse(localStorage.getItem("broadcast"));
            document.getElementById("name").value = obj.name;
            

            var tester=new Image();
            tester.addEventListener("load", e => addImage(obj));
            tester.src=obj.cover;
    document.getElementById("description").value = obj.description;
                document.getElementById("accestype").innerText = obj.acces;
                document.getElementById("category").innerText = obj.category;
                actualcategory = categorysnippet[Array.from(document.getElementById("dropdown2").children).findIndex((x) => x.innerText === obj.category)];
                document.querySelector("input[type=checkbox]").checked =obj.forkids;
                checkdate(obj);
                if (JSON.parse(obj.servers).length === 0 ){
                        add_server(1);
                    }
                    let i = 0;
                JSON.parse(obj.servers).forEach(element => {
               
                        switch (element.service){
                          
                            case "rtmp":
                                add_server(1);
                                try{
                                        document.getElementById("servers").children[i].children[0].children[0].children[1].value = element.rtmp;
                                        servers[servers.length-1].rtmp = element.rtmp;
                                        servers[servers.length-1].chat = element.chat;
                                }catch{

                                }
        
                                break;
                                case "youtube":
             
                            add_server(0);
                            servers[servers.length-1].rtmp = element.rtmp;
                            servers[servers.length-1].chat = element.chat;

                                    break;
                        }
                   
                    
            i++;
                    });
        }catch(e){
             //   if (String(e))
           if (String(e).startsWith("SyntaxError: Unexpected end of JSON input")){
            add_server(1);
           }
           document.querySelector("#date").valueAsDate = new Date();
           document.getElementById("hours").value = new Date().getHours();
           document.getElementById("minutes").value = new Date().getMinutes();

        }
    
                
    }


    function add_server(num){
        let serverel = document.getElementById("servers");
        let container = document.createElement("div");
        container.classList.add("input-field");
        container.classList.add("col");
        container.classList.add("s12");
        let form = document.createElement("form");
        form.classList.add("input-field-form");
        form.style.borderRadius = "0";
        container.appendChild(form);
        
       if (document.getElementsByClassName("preferences-group-body")[1].children.length === 1   ){
            if (document.getElementsByClassName("preferences-group-body")[1].children[0].children[0].children[1].style.display === "none"){
                document.getElementsByClassName("preferences-group-body")[1].children[0].children[0].children[1].style.display = "block";
            }
       }
        switch (num){
            case 0:
                
                console.log("youtube");
                let youtube = document.createElement("div");
                let youtube_icon = document.createElement("img");
                youtube_icon.src = "symbols/youtube-icon.svg"
                youtube_icon.classList.add("button_icon");
                youtube_icon.style.height = "23px";
                youtube.style.display = "flex";
                youtube.style.alignItems = "center";
                youtube.style.gap = "0.5em"
                youtube.innerText = "Youtube";
                let server_container = document.createElement("div");
                server_container.style.width = "100%";
                server_container.style.display = "flex";
                server_container.style.justifyContent = "space-between"
                youtube.insertBefore(youtube_icon, youtube.firstChild);
                server_container.append(youtube);
                form.append(server_container);
                document.getElementsByClassName("popr-box")[1].children[num].style.display = "none";

              //  <img src="symbols/user-trash-symbolic.svg" class="highlight_icon">
              let trash = document.createElement("img");
              trash.classList.add("highlight_icon");
              trash.src = "symbols/user-trash-symbolic.svg";
              form.append(trash);
              let servic = new server("youtube", "");
                servers[servers.length] =servic;
            trash.addEventListener("click", (e) => {
                servers = array_remove(servers, servers.findIndex((e) => e.service === "youtube"));

                document.getElementsByClassName("popr-box")[1].children[num].style.display = "block";
                if (Array.from(e.target.parentNode.parentNode.parentNode.children).length == 2){
                    Array.from(e.target.parentNode.parentNode.parentNode.children).forEach((x) => {
                        
                        x.children[0].children[1].style.display = "none"     
                    })     
             
            }
            else if (e.target.parentNode.parentElement.parentElement.children.length === 1){
                    add_server(1);
                }
                e.target.parentNode.parentNode.remove();

        });
         
                
                break;
            case 1:
                console.log("RTMP");
                let rtmp_label = document.createElement("label");
                rtmp_label.classList.add("input-label");
                rtmp_label.classList.add("active");
                rtmp_label.forhtml = "rtmp" + servercounts;
                rtmp_label.innerText = "Адреса RTMP-клієнта";
                let rtmp = document.createElement("input");
                rtmp.id = "rtmp" + servercounts;
                rtmp.classList = "input-row";
                rtmp.placeholder = "rtpm://localhost:3000/default/";
                let rtmp_container = document.createElement("div");
                rtmp_container.style.width = "92%";
                rtmp_container.append(rtmp_label);
                rtmp_container.append(rtmp);
                let rtrash = document.createElement("img");
              rtrash.classList.add("highlight_icon");
              rtrash.src = "symbols/user-trash-symbolic.svg";
              rtrash.addEventListener("click", (e) => {
                servers = array_remove(servers, Array.from(e.target.parentNode.parentNode.parentNode.children).findIndex((x) =>
          
                x === e.target.parentNode.parentNode));
                if (Array.from(e.target.parentNode.parentNode.parentNode.children).length == 2){
                    Array.from(e.target.parentNode.parentNode.parentNode.children).forEach((x) => {
                        x.children[0].children[1].style.display = "none"     
                    })     
              }
              if (e.target.parentNode.parentElement.parentElement.children.length === 1){
                    add_server(1);
                }
              e.target.parentNode.parentNode.remove();

            });
                form.append(rtmp_container);
                form.append(rtrash);

                let service = new server("rtmp", rtmp.value, servercounts);
                rtmp.addEventListener("focus", (x) => {
         rtmp.parentElement.parentElement.setAttribute("style", " border: 3px solid #677a93ff !important");
         if  ((Array.from(rtmp.parentElement.parentElement.parentElement.parentElement.children).findIndex((x) => 
         x === rtmp.parentElement.parentElement.parentElement) === 0) 
         && (Array.from(rtmp.parentElement.parentElement.parentElement.parentElement.children).length !=   1) ){
            rtmp.parentElement.parentElement.setAttribute("style", "border-radius: 1em 1em 0 0; border: 3px solid #677a93ff !important");
        }else if  ((Array.from(rtmp.parentElement.parentElement.parentElement.parentElement.children).findIndex((x) => 
        x === rtmp.parentElement.parentElement.parentElement) === Array.from(rtmp.parentElement.parentElement.parentElement.parentElement.children).length-1)
         && (Array.from(rtmp.parentElement.parentElement.parentElement.parentElement.children).length !=   1) )
        {
            rtmp.parentElement.parentElement.setAttribute("style", "border-radius: 0 0 1em 1em; border: 3px solid #677a93ff !important");
        }
    })
    rtmp.addEventListener("focusout", (x) => {
        rtmp.parentElement.parentElement.setAttribute("style", "border: 0 !important; border-radius: 0 !important");

    })
                servers[servers.length] = service;
                break;
        }
        serverel.append(container);
        servercounts++;
    }
    function save(){
        let i = 0;
        servers.forEach((e) => {
            
            if (e.service === "rtmp"){
                if (String(document.getElementById("rtmp" + e.id).value).includes("://")){
                    e.rtmp = document.getElementById("rtmp" + e.id).value;
                }else{ 
                    servers = array_remove(servers, i);
                    
                }   
            }
            i++;
        })
        let hours; let minutes; hours = document.getElementById("hours").value;
        if (hours.length === 1){ hours = "0" + hours}
        minutes = document.getElementById("minutes").value;
        if (minutes.length === 1){ minutes = "0" + minutes}

      localStorage.setItem("broadcast", JSON.stringify(new broadcast(document.getElementById("name").value,
       decodeURI(document.getElementById("cover").src),
            document.getElementById("description").value,
        document.getElementById("accestype").innerText,
        document.getElementById("category").innerText,
        document.querySelector("input[type=checkbox]").checked,
        JSON.stringify(servers),
    document.getElementById("date").value,
    (hours + ":" + minutes)
)

    )); 
    }
    function choose(dropdown, i){
            document.getElementsByClassName(dropdown)[0].children[0].innerText = 
            document.getElementById(dropdown).children[i].innerText;
            actualcategory = categorysnippet[i];
    } // $('.dropdown-trigger').dropdown();



    let scrollbars = document.getElementsByClassName("no-scrollbar");
   for (let i =0; i < scrollbars.length; i++){
    let elem = scrollbars[i];
    let timer;
   elem.addEventListener('scroll', function(e) {

elem.classList.remove('no-scrollbar');
elem.classList.add('scrollbar');
    

clearTimeout(timer);
timer = setTimeout(function() {
     elem.classList.add('no-scrollbar');
     elem.classList.remove('scrollbar');
}, 100);

})}
document.getElementById("create_button").addEventListener("click", (e) => {
    if (!broadcast_creating){
        let oldver;
    try{
    oldver = JSON.parse(localStorage.getItem("broadcast"));}
    catch{
        save();
      oldver = JSON.parse(localStorage.getItem("broadcast"));
    }
    servers.forEach((element) => {
        if (element.service === "youtube"){
            if ((element.rtmp === "") || (oldver.name !== document.getElementById("name").value) || (oldver.description !== document.getElementById("description").value) ||  (decodeURI(oldver.image) !== decodeURI(document.getElementById("cover".src))) || (oldver.category !== document.getElementById("category").innerText) || (oldver.acces !== document.getElementById("accestype").innerText) || (oldver.forkids !== document.querySelector("input[type=checkbox]").checked)){
           //     console.log("youtube_create");
                generate_youtube_rtmp(element); 
            }
        }

    })}
});
document.getElementById("refresh").addEventListener("click", (e) =>{
    localStorage.setItem("broadcast", "");
    location.reload();
}) 
async function generate_youtube_rtmp(element){
    let acces;
    switch (document.getElementById("accestype").innerText){
        case "Загальнодоступне":
            acces = "public"
            break;
        case "Для тих, в кого є посилання":
            acces = "unlisted";
            break;
        case "Приватне":
            acces = "private";
            break;

    }
    let timedate; 
    try{
        timedate = new Date(document.getElementById("date").value + " " 
        +document.getElementById("hours").value + ":" +
         document.getElementById("minutes").value).toISOString()
    }catch{
        
    }
    broadcast_creating = true;

    const link = await JSON.parse(await generate_youtube_broadcast(document.getElementById("name").value,
     document.getElementById("description").value, 
     document.getElementById("cover"),
     actualcategory, acces, document.querySelector("input[type=checkbox]").checked, timedate));
    console.log(link);
   element.rtmp = link.rtmp;
   element.chat = link.chat;
   save();
    console.log(servers);
   broadcast_creating = false;
}