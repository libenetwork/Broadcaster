let micro = [];
(async () => {
    await navigator.mediaDevices.getUserMedia({audio: true});
    let devices = await navigator.mediaDevices.enumerateDevices();
    devices.forEach((device) =>
    {
        if (device.kind === "audioinput"){

            micro.push(device);
        }
    });
    console.log(micro);

    micro.forEach((device) => {
        let dev_source = document.createElement("div");
        let menu = document.getElementsByClassName("popr-box")[0];
        dev_source.classList.add("popr-item");
        let icon = document.createElement("img");
        icon.src = "symbols/microphone2-symbolic.svg";
        icon.classList.add("button_icon");
        icon.classList.add("min-size");
        dev_source.append(icon);
        let caption = document.createElement("p");
        caption.innerText = device.label;
        caption.classList.add("popr-text")
        dev_source.classList.add("popr-caption");
        dev_source.append(caption);
        dev_source.classList.add("popr-elem");
        menu.append(dev_source);


    });

    // microphone.innerHTML = append;
})();
