let token; let isnewtoken = false;
if (getCookie("token") === "" || getCookie("token") === "[object Promise]"){
    console.log("no token!");
    token = Math.random() * 10000;
    token = token.toString().hashCode();
    setCookie("token", token, 1000000);
    isnewtoken = true;
    document.getElementById("token").innerHTML =window.location.protocol + "//" + window.location.host.split(":")[0] + '/webhook/' + token;
}else{
    token = getCookie("token");
    document.getElementById("token").innerHTML =window.location.protocol + "//" + window.location.host.split(":")[0] + '/webhook/' + token;

}
const webhookclient = new WebSocket(
    window.location.protocol.replace('http', 'ws') + '//' + // http: => ws:, https: -> wss:
    window.location.host +
    '/webhook/' +
    token
);
webhookclient.addEventListener("open", e => {console.log("Was connected!")})
