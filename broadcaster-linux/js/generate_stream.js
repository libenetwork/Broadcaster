async function generate_youtube_broadcast(name, description, thumbnail, category, acces, forkids, time){
        const API_KEY = "AIzaSyAMeKqorMHCc910lG6t-uDa0LX3xl5swB0";
        const headers = new Headers({
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("youtube_token")).tokens.access_token}`,
            'Content-Type': 'application/json'
        });
        const thumbnail_headers = new Headers({
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("youtube_token")).tokens.access_token}`,
            'Content-Type': 'image/png'
        });
        const body = JSON.stringify({
            snippet: {
                title: name,
                description: description,
                scheduledStartTime: time,

            },
            status: {
                privacyStatus: acces,
                selfDeclaredMadeForKids: forkids

            }
        });
        console.log(body);
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet,status&key=${API_KEY}`,
            {
              method: 'POST',
              headers: headers,
              body: body
            }
            
          );
          const data = await response.json();
          const id = data.id;

          console.log(data);
          const thumbnail_data = JSON.stringify({
                
                    "default": {
                            "url": decodeURI(thumbnail.src),
                            "width": thumbnail.naturalWidth,
                            "height": thumbnail.naturalHeight
                    }
                
});
console.log(  `https://youtube.googleapis.com/youtube/v3/thumbnails/set?videoId=${id}&key=${API_KEY}`);
          const thumbnail_response = await fetch(
            `https://youtube.googleapis.com/youtube/v3/thumbnails/set?videoId=${id}&key=${API_KEY}`,
            {
                method: 'POST',
                headers: thumbnail_headers,
                body: thumbnail_data
            }
            
          );
          const thumbnail_answare = await thumbnail_response.json();

     
        
}
