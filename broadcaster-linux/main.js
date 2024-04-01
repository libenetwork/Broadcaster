const { app, BrowserWindow, ipcMain, desktopCapturer, session } = require('electron')
const electron = require("electron")
const path = require("path");


function open_scene(){
    const scene = new BrowserWindow({
        webPreferences: {
            allowRunningInsecureContent: true,
            nodeIntegration: true,
            contextIsolation: false, devTools: true},
        fullscreen:true,
        frame: false,
        transparent: true
    })
    ipcMain.on('get-sources', () => {

        return desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
            console.log(sources);

            for (const source of sources) {
                console.log(source.id);

                scene.webContents.send("source_id", source.id);
            }
        })
    });

    scene.loadFile("video.html");

}
function createmainwindow(){
    const window = new BrowserWindow({
        webPreferences: {
            allowRunningInsecureContent: true,
            nodeIntegration: true,
            contextIsolation: false},
        preload: path.join(__dirname, 'preload.js'),
        height: 780,
        minWidth: 765,
        minHeight: 780,
        icon: 'img/icon1024',
        frame: false,
        transparent: true
    })

    ipcMain.on('get-frame', () => {

        return desktopCapturer.getSources({ types: ['window'] }).then(async sources => {
            console.log(sources);

            for (const source of sources) {
                console.log(source.id);

                window.webContents.send("frame_id", source.id);
            }
        })
    });


    ipcMain.on("open_scene", (e) => {
        console.log("open_scene");
        open_scene();
    });
    window.on("maximize", (e) =>{
        window.webContents.send('maximize');

    });
    window.loadFile("broadcaster.html");

    window.on("unmaximize", (e) =>{

        window.webContents.send('return');

    });
    async function hash(string) {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    }
     session.defaultSession.cookies.get({name: "token"})
        .then((cookies) => {
            console.log(cookies);

   let token_cookie = cookies[0].value;

    if (token_cookie === ""){
        console.log("no token!");
        token = Math.random() * 10000;
        hash(token.toString()).then((hex) => { console.log(hex);
            token = hex;
            const cookie = {url: "https://broadcaster-uozh.onrender.com", name: "token", value: token, expirationDate: 1000000000000000};
                session.defaultSession.cookies.set(cookie)
            .then(() => {
                console.log(cookie);
                window.webContents.send("cookie_token", cookie);
                    // success
                }, (error) => {
                    console.error(error)
                });

            }
        );
    }else {
        window.webContents.send("cookie_token", token_cookie);
    } }).catch((error) => {
    console.log(error)


});
}
//const nativeTheme = electron.remote.nativeTheme
function createaddwindow(path){
    //console.log("yes");
    const window = new BrowserWindow({
        webPreferences: {
            allowRunningInsecureContent: true,
            nodeIntegration: true,
            contextIsolation: false},
        height: 600,
        width:900,
        frame: true,
        parent: BrowserWindow.getAllWindows()[1],
        transparent: false
    })
    window.loadURL(path);
    window.on("page-title-updated", () => {

        if (window.webContents.getURL().split("?")[0] === "https://broadcaster-uozh.onrender.com/"){

          BrowserWindow.getAllWindows()[1].webContents.send("response", window.webContents.getURL());
            window.destroy();


        }
    })

}
const createWindow = (path) => {
    const window = new BrowserWindow({
        webPreferences: {
            allowRunningInsecureContent: true,
            nodeIntegration: true,
        contextIsolation: false},
        height: 720,
        icon: 'img/icon1024',
        frame: false,
        transparent: true
    })
    ipcMain.on('close', () => {
        app.quit()
    })
    ipcMain.on("closewindow", () => {
        window.close();
    })
    ipcMain.on("mainwindow", () => {
        createmainwindow();
    })
    ipcMain.on('window', (e, url) =>
    {
        createaddwindow(url);
    });
    window.on("maximize", (e) =>{
        window.webContents.send('maximize');

    });
    window.on("unmaximize", (e) =>{

        window.webContents.send('return');

    });
    window.loadFile(path, this);
}

app.whenReady().then(() => {
    createWindow("index.html");
})
app.on("browser-window-created", (e, win) => {
    //win.removeMenu();
});

