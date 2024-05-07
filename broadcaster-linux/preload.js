const { contextBridge,ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    getSources: () => {console.log("capture"); ipcRenderer.invoke('get-sources')},
});
