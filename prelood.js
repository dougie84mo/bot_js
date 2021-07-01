const {contextBridge, ipcRenderer} = require('electron');
// const path = require('path');

contextBridge.exposeInMainWorld('election', {
   notificationApi: {
       sendNotification(message) {
           ipcRenderer.send('notify', message);
       }
   }
});

contextBridge.exposeInMainWorld('darkMode', {
   toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
   system: () => ipcRenderer.invoke('dark-mode:system')
});