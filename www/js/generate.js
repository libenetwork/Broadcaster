import { HfInference } from "https://esm.sh/@huggingface/inference"
const hf = new HfInference('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');
webhookclient.addEventListener("message", e => {
    console.log(JSON.parse(decodeURI(e.data)).message);
    console.log("Message from server ", decodeURI(e.data));

    bc.postMessage(decodeURI(e.data));

})