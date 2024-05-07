const { app, BrowserWindow, ipcMain, desktopCapturer, session, clipboard, dialog } = require('electron')
const fs = require("fs");
const sharp = require("sharp");
const electron = require("electron")
const path = require("path");
let open_donate = false;
let open_broadcast = false;
let open_scene_w = false;
let open_dialogue = false;
let window;


console.log ("Broadcaster, version 0.0.1. Naumenko \nApp for internet broadcasting!");
function open_scene(){
    if (!open_scene_w){
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
    scene.on("closed", () => {try{open_scene_w = false; window.webContents.send("scene_destroyed")}
catch(e){}});
    open_scene_w = true;
    }else{
        window.webContents.send("scene_opened");
    }
}

function createmainwindow(){
     window = new BrowserWindow({
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
    ipcMain.on("copy", (e, data) => {
        clipboard.writeText(data);
        let clipboardStr = clipboard.readText();
        console.log(clipboardStr);
    })
    window.on("closed", () => {
app.quit();
    })
    ipcMain.on("open_donate", () => {
        console.log(open_donate);
        if (!open_donate){
        const donate_window = new BrowserWindow({
            webPreferences: {
                allowRunningInsecureContent: true,
                nodeIntegration: true,
                contextIsolation: false},
            parent: window,
            height: 500,
            maxWidth: 400,
            minWidth: 400,
            width:400,
            maxHeight: 500,
            minHeight: 500,
            icon: 'img/icon1024',
            frame: false,
            transparent: true,

        });
        donate_window.on("closed", (e) => {
            open_donate = false;
        })
        donate_window.loadFile("donate.html");
        open_donate = true;
    }
    })
    ipcMain.on("open_broadcast", () => {
        console.log(open_broadcast);
        if (!open_broadcast){
        const broadcast_window = new BrowserWindow({
            webPreferences: {
                allowRunningInsecureContent: true,
                nodeIntegration: true,
                contextIsolation: false},
            parent: window,
            height: 800,
            maxWidth: 500,
            minWidth: 500,
            width:500,
            maxHeight: 800,
            minHeight: 800,
            icon: 'img/icon1024',
            frame: false,
            transparent: true,
        });
        broadcast_window.loadFile("broadcast_create.html");
        ipcMain.on("open_cover", (e) => {
            if (!open_dialogue){
                open_dialogue = true;
            dialog.showOpenDialog(broadcast_window, {
                properties: ['openFile'],
                
                    filters: [
                      { name: 'Зображення', extensions: ['jpg', 'png', 'webp'] }
                    ]
                  
              }).then(result => { 
                open_dialogue = false;
                const fileBytes = require('file-bytes');
                console.log(result.filePaths);
                console.log(fileBytes.sync(result.filePaths[0]));
                if (fileBytes.sync(result.filePaths[0]) > 2097152){
                    console.log("compress!");
                    fs.readFile(result.filePaths[0], async function(err, e){
                  
                    fs.access("./compressed", (error) => {
                        if (error) {
                          fs.mkdirSync("./compressed");
                        }

                      });
                    switch (result.filePaths[0].split(".")[result.filePaths[0].split(".").length - 1]){
                        case "jpg":{
                         let dest = "./compressed/" + result.filePaths[0].split("/")[result.filePaths[0].split("/").length - 1];
                        await sharp(e).jpeg({quality: 70}).toFile(dest).then(() => {
                            if (fileBytes.sync(dest) > 2097152){
                                window.webContents.send("cover_file", "err0");
                            }else{
                                const sizeOf = require("image-size");
                                const dimmensions = sizeOf(result.filePaths[0]);
                                if ((dimmensions.width > 640) && (dimmensions.width / dimmensions.height === 16/9)){
                                    window.webContents.send("cover_file", dest);
                                }else{
                                    window.webContents.send("cover_file", "err1");
                                }
                            }
                        });
                        
                        
                        }
                        break;
                        case "png":
                            {
                                let dest = "./compressed/" + result.filePaths[0].split("/")[result.filePaths[0].split("/").length - 1];
  
                                await sharp(e).png({quality: 70}).toFile(dest).then(() => {
                                    if (fileBytes.sync(dest) > 2097152){
                                        window.webContents.send("cover_file", "err0");
                                    }else{
                                        const sizeOf = require("image-size");
                                        const dimmensions = sizeOf(result.filePaths[0]);
                                        if ((dimmensions.width > 640) && (dimmensions.width / dimmensions.height === 16/9)){
                                            window.webContents.send("cover_file", dest);
                                        }else{
                                            window.webContents.send("cover_file", "err1");
                                        }                                    }
                                });
                            }
                            break;
                            case "webp":
                                {
                                    let dest = "./compressed/" + result.filePaths[0].split("/")[result.filePaths[0].split("/").length - 1];
      
                                    await sharp(e).webp({quality: 70}).toFile(dest).then(() => {
                                        const sizeOf = require("image-size");
                                        const dimmensions = sizeOf(result.filePaths[0]);
                                        if ((dimmensions.width > 640) && (dimmensions.width / dimmensions.height === 16/9)){
                                            window.webContents.send("cover_file", dest);
                                        }else{
                                            window.webContents.send("cover_file", "err1");
                                        }
                                    });
                                }  
                                break;

                    }
                    });
        }else{
                const sizeOf = require("image-size");
                const dimmensions = sizeOf(result.filePaths[0]);
                if ((dimmensions.width > 640) && (dimmensions.width / dimmensions.height === 16/9)){
                    window.webContents.send("cover_file", result.filePaths);
                }else{
                    window.webContents.send("cover_file", "err1");
                }
              //  window.webContents.send("cover_file", result.filePaths)
                
            }  }).catch(err => {
                console.log(err)
              })
        }
    })
        broadcast_window.on("closed", () => {open_broadcast = false;})
        open_broadcast = true;
    }
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
    ipcMain.on("ready", (e) => {
        console.log("ready!");

     session.defaultSession.cookies.get({name: "token"})
        .then((cookies) => {
            console.log(cookies);
            let token_cookie = ""
            try{
    token_cookie = cookies[0].value;
            }catch{

            }
            
    if (token_cookie === ""){
        console.log("no token!");
        token = Math.random() * 10000;
        hash(token.toString()).then((hex) => { console.log(hex);
            token = hex;
            const cookie = {url: "https://broadcaster-uozh.onrender.com", name: "token", value: token, expirationDate: 1000000000000000};
            
                session.defaultSession.cookies.set(cookie)
            .then(() => {
                console.log(cookie);
                window.webContents.send("cookie_token", cookie.value);
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


});});
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
            window.close();


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
    ipcMain.on("closewindow", (event) => {
        
        event.sender.destroy();
       
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

