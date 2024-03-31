async function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
    return hashHex;
}

if (getCookie("token") === "" || getCookie("token") === "[object Promise]"){
    console.log("no token!");
    token = Math.random() * 10000;
    hash(token.toString()).then((hex) => { console.log(hex);
        token = hex;
        setCookie("token", token, 1000000);
        webhookclient = new WebSocket(
            'ws://localhost:3000/webhook/' +
            token
        );
        webhookclient.addEventListener("open", e => {console.log("Was connected!")})

    }); // '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'


    isnewtoken = true;
   // document.getElementById("token").innerHTML =window.location.protocol + "//" + window.location.host.split(":")[0] + '/webhook/' + token;
}else{
    token = getCookie("token");
    webhookclient = new WebSocket(
        'ws://localhost:3000/webhook/' +
        token
    );
    webhookclient.addEventListener("open", e => {console.log("Was connected!")})


}

