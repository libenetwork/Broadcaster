let youtubesocket;
function youtube_authorise() {
    youtubesocket = new WebSocket(
        window.location.protocol.replace('http', 'ws') + '//' + // http: => ws:, https: -> wss:
        window.location.host +
        '/youtube/auth'
    );
    youtubesocket.addEventListener("message", e => {
        window.open(e.data, 0,popup = 1);
    });
}