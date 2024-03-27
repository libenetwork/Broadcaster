import { client } from "https://cdn.jsdelivr.net/npm/@gradio/client@0.1.4/dist/index.min.js";

webhookclient.addEventListener("message", e => {
    let data = JSON.parse(decodeURI(e.data)).name.replaceAll("+", " ").replaceAll("%2C", ",").replaceAll("%3B", ";").replaceAll("%3A", ":") + " задон+атив " + JSON.parse(decodeURI(e.data)).amount + " гривень і сказав «" + JSON.parse(decodeURI(e.data)).message.replaceAll("+", " ").replaceAll("%2C", ",").replaceAll("%3B", ";").replaceAll("%3A", ":") + "»";

    generate(data, e)
})
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
    //return JSON.stringify(json);
    console.log("generated");
    bc.postMessage(JSON.stringify(json));
   // console.log(url);
}