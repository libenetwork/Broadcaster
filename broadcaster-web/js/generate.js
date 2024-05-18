import { client } from "https://cdn.jsdelivr.net/npm/@gradio/client@0.1.4/dist/index.min.js";
async function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
    return hashHex;
}
if (localStorage.token === undefined){
    token = Math.random() * 10000;
    hash(token.toString()).then((hex) => { console.log(hex);
        localStorage.setItem("token", 'https://broadcaster-uozh.onrender.com/webhook/' + hex);
    });
}else{
    let webhookclient;
    token = localStorage.token;
 
    webhookclient = new WebSocket(
        'wss://broadcaster-uozh.onrender.com/webhook/' +
        token
    );
    webhookclient.addEventListener("open", e => {console.log("Was connected!")})
    webhookclient.addEventListener("message", e => {
        let data = JSON.parse(decodeURI(e.data)).name.replaceAll("+", " ").replaceAll("%2C", ",").replaceAll("%3B", ";").
        replaceAll("%3A", ":") + " задон+атив " + JSON.parse(decodeURI(e.data)).amount + " гривень і сказав «" + JSON.parse(decodeURI(e.data)).message.replaceAll("+", " ").replaceAll("%2C", ",").replaceAll("%3B", ";").replaceAll("%3A", ":").replaceAll("Франко", "Фанк+о") + "»";
    
        generate(data, e);
    })

}

async function generate(text, e){
    console.log("generation started!");
    const app = await client("https://robinhad-ukrainian-tts.hf.space/");
    const result = await app.predict("/predict", [
        text, // string  in 'Input' Textbox component
        "Дмитро (чоловічий) 👨", // string  in 'Voice' Radio component
        // string  in 'Accentor' Radio component
    ]);
    const link = result.data[0].data;

    let json = JSON.parse(decodeURI(e.data));
    json.link = link;
    const currentdate = new Date();

    json.datetime = currentdate.getDay() + "/" + currentdate.getMonth()
        + "/" + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    //return JSON.stringify(json);
    console.log("generated");
    donate[donate.length] = json;
    bc.postMessage(JSON.stringify(json));
   // console.log(url);
}
