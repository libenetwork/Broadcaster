const { app, BrowserWindow, ipcMain } = require('electron')
const electron = require("electron")
const path = require("path");

//const nativeTheme = electron.remote.nativeTheme
function createaddwindow(path){
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

        if (window.webContents.getURL().split("?")[0] === "http://localhost:3000/"){

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
        height: 800,
        icon: 'img/icon1024',
        frame: false,
        transparent: true
    })
    ipcMain.on('close', () => {
        app.quit()
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

