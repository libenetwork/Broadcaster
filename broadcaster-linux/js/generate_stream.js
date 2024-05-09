const API_KEY = "AIzaSyAMeKqorMHCc910lG6t-uDa0LX3xl5swB0";
async function generate_youtube_broadcast(name, description, thumbnail, category, acces, forkids, time){
        
        const headers = new Headers({
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("youtube_token")).tokens.access_token}`,
            'Content-Type': 'application/json'
        });
       
        const body = JSON.stringify({
            snippet: {
                title: name,
                scheduledStartTime: time,

            },
            status: {
                privacyStatus: acces,
                selfDeclaredMadeForKids: forkids

            }
        });
        console.log(body);
        let link = ""; let data;
        try{
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet,status&key=${API_KEY}`,
            {
              method: 'POST',
              headers: headers,
              body: body
            }
            
          );
        
   
          switch (response.status){
            case 200:
           data = await response.json();

         await setthumbnail(data.id, thumbnail);
         await setinfo(data.id, name, description, category);
         let stream =await generate_stream(name);
         await bind(data.id, stream.id);
         link = stream.cdn.ingestionInfo.ingestionAddress + "/" + stream.cdn.ingestionInfo.streamName;
        break;
        case 401:
            break;
        case 400:
             data = await response.json();
             switch (data.error.message){
                case "Title is invalid":
                alert("Необхідно ввести назву відео");
                
                break;
                case "Scheduled start time is required":
                    alert("Дата чи час введенні некоректно");
                    
             }
             broadcast_creating = false;
            break;
        }}catch{
            
        }
        return link;
}
async function setthumbnail(id, thumbnail){
    let type = decodeURI(thumbnail.src).split(".")[decodeURI(thumbnail.src).split(".").length-1];
    switch (type){
          case "jpg":
              type = "image/jpeg";
              break;
          case "jpeg":
              type = "image/jpeg";
              break;
          case "png":
              type = "image/png";
              break;
    }
    let image = await fetch(decodeURI(thumbnail.src)).then(r => r.blob());
    const headers = new Headers({
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("youtube_token")).tokens.access_token}`,
        'Content-Type': type
    });
    const response = await fetch(`https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${id}&uploadType=media`, 
{
    method: 'POST',
    headers: headers,
    body: image
})
}
async function setinfo(id, title, description,category){
 const headers = new Headers({
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("youtube_token")).tokens.access_token}`,
    'Content-Type': 'application/json'
 });
  const body = JSON.stringify({
    id: id,
    snippet:{
        title: title,
        description: description,
        categoryId: category
    }
  });
  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${API_KEY}`, 
  {
      method: 'PUT',
      headers: headers,
      body: body
  })

}
async function generate_stream(title){
    const headers = new Headers({
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("youtube_token")).tokens.access_token}`,
        'Content-Type': 'application/json'
     });
     const body = JSON.stringify({
            snippet:{
                title: title
            },
            cdn:{
                frameRate: "30fps",
                ingestionType: "rtmp",
                resolution: "1080p"
            }
     });
     const response = await fetch(`https://www.googleapis.com/youtube/v3/liveStreams?part=snippet,cdn&key=${API_KEY}`, 
     {
         method: 'POST',
         headers: headers,
         body: body
     })
     const data = await response.json();
     return data;
}
async function bind(broadcastId, streamId){
    const headers = new Headers({
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("youtube_token")).tokens.access_token}`,
        'Content-Type': 'application/json'
     });
     const response = await fetch(`https://www.googleapis.com/youtube/v3/liveBroadcasts/bind?part=id&id=${broadcastId}&streamId=${streamId}&key=${API_KEY}`, 
     {
         method: 'POST',
         headers: headers
     })

}

