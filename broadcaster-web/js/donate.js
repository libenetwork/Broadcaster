let scrollbars = document.getElementsByClassName("no_scrollbar");
for (let i; i < scrollbars.length; i++){
 let elem = scrollbars[i];
elem.addEventListener('scroll', function(e) {

elem.classList.remove('no-scrollbar');
elem.classList.add('scrollbar');
 

clearTimeout(timer);
timer = setTimeout(function() {
  elem.classList.add('no-scrollbar');
  elem.classList.remove('scrollbar');
}, 100);

})}
if (document.getElementsByClassName("collapsible")[0].childElementCount === 0){
    document.getElementsByClassName("preferences-group")[0].classList.add("not-show");
    document.getElementsByClassName("preferences-group")[1].classList.add("not-show");
    document.getElementsByClassName("collapsible")[0].classList.remove("not-show");

    document.getElementsByClassName("collapsible")[1].classList.remove("not-show");
}
document.getElementById("token").value = localStorage.getItem("token");
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, {
        accordion: false
    });
});
wc.postMessage("get_donates");
wc.addEventListener("message", (e) =>{
    console.log(e.data);
    if (String(e.data).startsWith("[") || String(e.data).startsWith("{")){

    
    amount = [];
     let obj = JSON.parse(decodeURI(e.data.replaceAll("+", " ").replaceAll("%2C", ",").replaceAll("%3B", ";").replaceAll("%3A", ":")));

    obj.forEach((e) =>  {create_donate(e, 1); amount[document.getElementsByClassName("collapsible")[1].childElementCount - 1] = Number(e.amount)});
   cleare_max();
   if (obj.length > 0){
    document.getElementsByClassName("preferences-group")[1].classList.remove("not-show");
    document.getElementsByClassName("preferences-group")[0].classList.remove("not-show");
    create_donate(obj[obj.findIndex((index) =>
       Number(index.amount) === Math.max(...amount))], 0);
   donate = obj;
    }
   }




});
bc.addEventListener("message", (e) => {
    let amount = [];
    console.log(e.data);
    let obj = JSON.parse(decodeURI(e.data.replaceAll("+", " ").replaceAll("%2C", ",").replaceAll("%3B", ";").replaceAll("%3A", ":")));
   donate[donate.length] = obj;
   donate.forEach((index) => amount[amount.length] = Number(index.amount));
    create_donate(obj, 1);
    cleare_max();
    create_donate(donate[donate.findIndex((index) =>
        Number(index.amount) === Math.max(...amount))], 0);



})
document.getElementsByClassName("copy")[0].addEventListener("click", copy_token);
document.getElementById("token").addEventListener("click", copy_token);
function copy_token(){
    let copy = document.getElementById("token").value;
    ipc.send("copy", copy);
}
const backgrounds = [
    "#f8e45c", "#62a0ea", "#57e389",   "#ffa348", "#ed333b", "#c061cb", "#b5835a"
];
function cleare_max(){
    document.getElementsByClassName("collapsible")[0].innerHTML = "";
}
function create_donate(obj, id){
    if (document.getElementsByClassName("collapsible")[0].childElementCount === 0){
        document.getElementsByClassName("donate-window")[0].classList.add("not-show");
        document.getElementsByClassName("preferences-group")[1].classList.remove("not-show");
        document.getElementsByClassName("preferences-group")[0].classList.remove("not-show");

        document.getElementsByClassName("collapsible")[0].classList.remove("not-show");
        document.getElementsByClassName("collapsible")[1].classList.remove("not-show");

    }
    let li = document.createElement("li");
    li.classList.add("collapsible-el");
    let header = document.createElement("div");
    header.classList.add("collapsible-header");
    let name = document.createElement("div");
    name.innerText = obj.name;
    let amount = document.createElement("span");
    amount.classList.add("badge");
    amount.innerText = obj.amount + " ₴";
    header.appendChild(name);
    header.appendChild(amount);
    li.appendChild(header);
    let body = document.createElement("div");
    body.classList.add("collapsible-body");
    let message = document.createElement("div");
    message.classList.add("collapsible-text");
    message.innerText = obj.message;
    let time = document.createElement("p");
    time.classList.add("collapsible-time");
    time.innerText = obj.datetime.split(" @ ")[1].split(":")[0] + ":" + obj.datetime.split(" @ ")[1].split(":")[1];
    body.appendChild(message);
    body.appendChild(time);
    li.appendChild(body);
    document.getElementsByClassName("collapsible")[id].insertBefore(li, document.getElementsByClassName("collapsible")[id].firstChild);
let color = Math.floor(Math.random()*backgrounds.length);
   amount.style.background = backgrounds[color]  + "4c";
   amount.style.setProperty("color", backgrounds[color], "important");
   // amount.style.color = "red";

}