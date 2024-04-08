ipc.send("ready");
ipc.on('cookie_token', (e,data) => {
    token = data;
    localStorage.setItem("token", 'https://broadcaster-uozh.onrender.com/webhook/' + token);

    webhookclient = new WebSocket(
        'wss://broadcaster-uozh.onrender.com/webhook/' +
        token
    );
    webhookclient.addEventListener("open", e => {console.log("Was connected!")})

});
