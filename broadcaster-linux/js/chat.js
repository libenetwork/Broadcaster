let chatitems = []
const chatinterval = setInterval(function() {
        checkchats();
}, 2000);
function checkchats(){
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
async function getyoutubechat(id){
    const headers = new Headers({
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("youtube_token")).tokens.access_token}`,
        'Content-Type': 'application/json'
    });
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${id}&part=id,snippet,authorDetails`,
        {
          method: 'GET',
          headers: headers
        }
        
      );
      data = await response.json();
      detect(data);
      chatitems = data.items;}
      
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
          console.log(`видалено: ${chatitems.findIndex(e => e === x)}`);
        }
      });
}
function create_message(message){
    

}

