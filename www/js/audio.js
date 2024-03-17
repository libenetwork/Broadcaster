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
    //console.log(micro);
    let append = " <a class=\"dropdown-item\" onClick=\"choose(0)\">Захоплення звуків пристрою</a>\n"; let i = 1;
  let microphone = document.getElementsByClassName("microphone")[1];

    micro.forEach((device) => {
        append += " <a class=\"dropdown-item\" onClick=\"choose(" + i + ")\">" + device.label + " </a>\n";
        i++;
    });

     microphone.innerHTML = append;
})();
