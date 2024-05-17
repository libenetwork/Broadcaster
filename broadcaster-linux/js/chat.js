const API_KEY = "AIzaSyAMeKqorMHCc910lG6t-uDa0LX3xl5swB0";
let chatitems = [];
let youtube_chat_id;
let last = "";
let last_message;
let can = true;
document.addEventListener("mousedown", e => {
  if (document.getElementsByClassName("context_menu")[0].style.display === "block"){
  document.getElementsByClassName("context_menu")[0].style.display = "none";
can = false;
}else{
  can = true;
}})
const chatinterval = setInterval(function() {
        checkchats();
}, 3000);
 function checkchats(){
    if (chatitems.length === 0){
        document.getElementById("no_comments").classList.remove("not-show");
        document.getElementById("comments_section").classList.add("not-show");


    }else{
      if (!document.getElementById("no_comments").classList.contains("not-show")){
        document.getElementById("no_comments").classList.add("not-show");
        document.getElementById("comments_section").classList.remove("not-show");
        document.getElementsByClassName("messages")[0].scrollTo(0, document.getElementsByClassName("messages")[0].scrollHeight)
      }

    }
    let chat_servers = JSON.parse(JSON.parse(localStorage.getItem("broadcast")).servers);
    if (chat_servers.length === 0) {

    }else{  
    chat_servers.forEach(element => {
        if (element.service === "youtube"){
            if ((element.chat !== "") && (element.chat !== undefined)){
                    getyoutubechat(element.chat);
            }
        }
    });}

}
async function get_moderators_list(id){

  const headers = new Headers({
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("youtube_token")).tokens.access_token}`,
    'Content-Type': 'application/json'
});
const response = await fetch(
  `https://www.googleapis.com/youtube/v3/liveChat/moderators?liveChatId=${id}&part=snippet`,
  {
    method: 'GET',
    headers: headers
  });
  let moderators = await response.json();
  first_moderators = false;
  return moderators;
  }

async function getyoutubechat(id){
  youtube_chat_id = id;
    const headers = new Headers({
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("youtube_token")).tokens.access_token}`,
        'Content-Type': 'application/json'
    });
    const response = await fetch(
        `https://yt.lemnoslife.com/noKey/liveChat/messages?liveChatId=${id}&part=id,snippet,authorDetails`,
        {
          method: 'GET',
          headers: headers
        }
        
      );
      data = await response.json();
      data.items = unbandata(data.items);
      detect(data);
      chatitems = data.items;}
      function unbandata(data){
        let new_data = [];
          data.forEach(element => {
              if (element.snippet.type === "textMessageEvent"){
                new_data[new_data.length] = element;
              }
          });
          return new_data;
      }
     // console.log(data.items);
     function detect(data){

     let itemmap = new Map(data.items.map((x) => [x.etag, x]));
     let chatitemmap = new Map(chatitems.map((x) => [x.etag, x]))
     data.items.forEach((x) => {
        if (!chatitemmap.has(x.etag)) {
          
          create_message(x);
        }
      });
      
      chatitems.forEach((x) => {
        if (!itemmap.has(x.etag)) {
          remove_message(chatitems.findIndex(e => e === x));
        }
      });
}
function create_message(message){
  if (message.snippet.userBannedDetails === undefined){
let messages = document.getElementsByClassName("messages")[0];
let message_container = document.createElement("div");
message_container.classList.add("message");
let avatar = document.createElement("div");
avatar.classList.add("avatar");
let message_content = document.createElement("div");
message_content.classList.add("message-content");
let index = data.items.findIndex((x) => message === x);
console.log(index);
let message_header = undefined;
try{
if (data.items[index-1].authorDetails.channelId !== message.authorDetails.channelId){

message_header = add_header(message, avatar);
}else{
  avatar.style.background = "none";
  avatar.style.height = "0px";
}
}catch{
 message_header =  add_header(message, avatar);

}
if (message_header !== undefined){
message_content.append(message_header);
}
let message_body = document.createElement("div");
message_body.classList.add("message-body");
message_body.innerText = message.snippet.textMessageDetails.messageText;
message_content.append(message_body);
message_container.append(avatar);
message_container.append(message_content);
messages.append(message_container);
messages.scrollTo(0, messages.scrollHeight)
message_container.addEventListener("contextmenu", e => {
        const target = getParents(e.target).find(x => x.classList.contains("message"));
      add_context(target, e.x, e.y);
})}
}
function getavatarletters(string){
  let result = "";
  let strings = string.split(" ");
    if (strings.length > 1){
        result = strings[0].substr(0,1).toUpperCase() +  strings[1].substr(0,1).toUpperCase() ;
    }else{
      let num = 0;
      while (num <= 0){
      num = Math.floor(Math.random() * strings[0].length) - 1;
    }
      result = strings[0].substr(0,1).toUpperCase() + strings[0].substr(num ,1).toUpperCase();
    }
    return result;
}
function add_header(message, avatar){
  if (message.authorDetails.profileImageUrl === ""){
    const color = hexToHSL(stringToColor(message.authorDetails.displayName));
   avatar.style.background =  `linear-gradient(to bottom, hsl(${color.h}deg ${color.s+ 10}% ${color.l+ 15}%) 0%,hsl(${color.h}deg ${color.s + 20}% ${color.l-5}%) 100%)`;
   avatar.innerText = getavatarletters(message.authorDetails.displayName);
   }else{
    avatar.style.background = `url(${message.authorDetails.profileImageUrl})`;
   }
let message_header = document.createElement("div");
message_header.classList.add("message-header");
let message_name = document.createElement("div");
message_name.classList.add("message-name");
message_name.innerText = message.authorDetails.displayName;
if (message.authorDetails.isChatOwner) {
message_name.classList.add("chat-owner");}
else if (message.authorDetails.isChatModerator){
  message_name.classList.add("chat-moderator");
}else if (message.authorDetails.isChatSponsor){
  message_name.classList.add("chat-sponsor");
}
if (message.authorDetails.isVerified){
let verified = document.createElement("img");
verified.classList.add("verified_icon");
message_name.classList.add("verified");
verified.src = "symbols/verified-checkmark-symbolic.svg"
message_name.append(verified);}
message_header.append(message_name);
let message_time = document.createElement("div");
message_time.classList.add("message-time");
message_time.innerText = new Date(message.snippet.publishedAt).getHours() + ":" + new Date(message.snippet.publishedAt).getMinutes();
message_header.append(message_time);
document.getElementsByClassName("messages")[0].scrollTo(0, document.getElementsByClassName("messages")[0].scrollHeight)
return message_header;
}
function stringToColor(str) {
  var hash = 0;
  var color = '#';
  var i;
  var value;
  var strLength;

  if(!str) {
      return color + "BBBBAB";
  }

  strLength = str.length;

  for (i = 0; i < strLength; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (i = 0; i < 3; i++) {
      value = (hash >> (i * 22)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
};


function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (H.length === 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length === 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return {h,s,l};
}

function remove_message(id){
 // console.log(id);
 const messages = document.getElementsByClassName("messages")[0].children;
 let target = messages[id];
 try{
  if ((target.children[0].style.background !== "none") &&
   (messages[id+1].children[0].style.background === "none")){

        messages[id+1].children[0].style.background = target.children[0].style.background;
        messages[id+1].children[0].innerText = target.children[0].innerText;
        messages[id+1].children[1].insertBefore(target.children[1].children[0], messages[id+1].children[1].firstChild)
        messages[id+1].children[0].style.height = "50px";


  }
  target.remove();
}
  catch{
    target.remove();
  }


}
async function postmessage(){
  let message;
  if (document.getElementById("message").value !== "🐟🦞🧅"){
   message =     document.getElementById("message").value;}else{
     message = "ТАНЦЮВАЛА РИБА З РАКОМ РИБА З РАКОМ А ПЕТРУШКА З ПАСТЕРНАКОМ З ПАСТЕРНАКОМ А ЦИБУЛЯ З ЧАСНИКОМ А ДІВЧИНА З КОЗАКОМ"
  }
  document.getElementById("message").value = "";
  document.getElementById("message").style.height = "1rem";
      const headers = new Headers({
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("youtube_token")).tokens.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    });
    const body = JSON.stringify(
      {
  "snippet": {
    "liveChatId": youtube_chat_id,
    "type": "textMessageEvent",
    "textMessageDetails": {
      "messageText": message
    }
  }
});
    console.log(body);
    const response = await fetch(

      `https://youtube.googleapis.com/youtube/v3/liveChat/messages?part=snippet&key=${API_KEY}`,
      {
        method: 'POST',
        headers: headers,
        body: body
      }
    ); 
     //console.log(await response.json());
 
     
}
function add_context(obj, x, y){
  if (can){
  let menu = document.getElementsByClassName("context_menu")[0];
  if (menu.style.display === "none" || menu.style.display === ""){
  menu.style.display = "block";
menu.style.left = x + "px";
menu.style.bottom = (document.body.offsetHeight - y) + "px";
menu.children[0].children[0].children[1].innerText = Array.from(obj.children[1].children).find(
  x => x.classList.contains("message-body")).innerText;
  menu.children[0].children[0].children[0].innerText = data.items[Array.from(document.getElementsByClassName("messages")[0].children).
findIndex(x => x === obj)].authorDetails.displayName;
  if (data.items[Array.from(document.getElementsByClassName("messages")[0].children).findIndex(x => x === obj)].authorDetails.isChatOwner){
    menu.children[0].children[2].style.display = "none";
    menu.children[0].children[3].style.display = "none";
 }else{
    menu.children[0].children[2].style.display = "flex"; 
    menu.children[0].children[3].style.display = "flex"; 

  }
  if (data.items[Array.from(document.getElementsByClassName("messages")[0].children).findIndex(x => x === obj)].authorDetails.isChatModerator)
  {
    menu.children[0].children[2].children[0].src = "symbols/security-low-symbolic.svg"; 
    menu.children[0].children[2].children[1].innerText = "Скасувати статус модератора";
  
  } else{
    menu.children[0].children[2].children[0].src = "symbols/security-medium-rtl-symbolic.svg"; 
    menu.children[0].children[2].children[1].innerText = "Зробити модератором";

  }
  menu.children[0].children[1].addEventListener("mousedown", e=> {
    message_delete(data.items[Array.from(document.getElementsByClassName("messages")[0].children).findIndex(x => x === obj)]);
  })
  menu.children[0].children[2].addEventListener("mousedown", e=> {
    make_moderator(data.items[Array.from(document.getElementsByClassName("messages")[0].children).findIndex(x => x === obj)]);
  })
anime({
  targets: menu,
  opacity: '100%',
  duration: 700
})
  }else{
    menu.style.opacity = 0;
    menu.style.display = "none";
  }}else{
    can = true;
  }
  
}
async function message_delete(message){
  if (message.id !== last){
    last = message.id;
    const headers = new Headers({
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem("youtube_token")).tokens.access_token}`,
      'Content-Type': 'application/json'
  });
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/liveChat/messages?key=${API_KEY}&id=${message.id}`,
    {
      method: 'DELETE',
      headers: headers
    });

  }
}
 function make_moderator(message){
    switch (message.authorDetails.isChatModerator){
      case false:
        set_moderator(message);
        break;
      case true:
        delete_moderator(message);
        break;
    }
}
async function set_moderator(message){
  const headers = new Headers({
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("youtube_token")).tokens.access_token}`,
    'Content-Type': 'application/json'
});
const body = JSON.stringify({
  "snippet": {
    "moderatorDetails":{
    "channelId": message.snippet.authorChannelId
  },
    "liveChatId": message.snippet.liveChatId
    
  }
});
const response = await fetch(
  `https://www.googleapis.com/youtube/v3/liveChat/moderators?key=${API_KEY}&part=snippet`,
  {
    method: 'POST',
    headers: headers,
    body: body
  });
  alert("Наступні пости "+ message.snippet.displayName + " будуть від імені модератора");

}
async function delete_moderator(message){
  if (last_message !== message){
  let moderators = await get_moderators_list(youtube_chat_id);
  let moderator_id = moderators.items.find(x => x.snippet.moderatorDetails.channelId === message.snippet.authorChannelId);
  if (moderator_id !== undefined){
  const headers = new Headers({
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("youtube_token")).tokens.access_token}`,
    'Content-Type': 'application/json'
});
const response = await fetch(
  `https://www.googleapis.com/youtube/v3/liveChat/moderators?key=${API_KEY}&id=${moderator_id.id}`,
  {
    method: 'DELETE',
    headers: headers
  });
  }else{
    alert("Користувач вже не є модератором або є супермодератором. Перейдіть на сторінку трансляції");
  }
}
last_message = message;
}
