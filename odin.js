const { BrowserWindow, app, ipcMain, nativeTheme } = require('electron');
const path = require('path');
const { env, deb} = require('./lib/config');
// const { Pro, BotApp} = require('./bot_thread');
// const { BotTestApp } = require('./test');
// const { command_task_list } = require('./lib/command');

function createWindow() {
    const win = new BrowserWindow({
        width: 1600,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'prelood.components')
        }

    });
    //Can be awaited?
    win.removeMenu();
    win.loadFile('index.html');
    ipcMain.handle('dark-mode:toggle', () => {
        nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark'
    })
    ipcMain.handle('dark-mode:system', () => {
        nativeTheme.themeSource = 'system'
    })
}
if (env.id === 0){
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    });
}


app.whenReady().then(createWindow)

// if (env.id === 0) { console.log('DEV MODE'); const action_process = Pro.choosable_list(command_task_list, "What would
//     you like to run? "); deb.med(action_process); test_app_feature(action_process); function
//     test_app_feature(action_value) { deb.med(action_value); let bot_app = { bot_app: () => {BotTestApp.test_app();},
//             profiles: () => {BotTestApp.test_profiles();}, monitor: () => {BotTestApp.test_monitors();}, raffle: ()
//             => {BotTestApp.test_monitors();}, checkout: () => {BotTestApp.test_app();}, }; deb.med(bot_app); if
//         (bot_app.hasOwnProperty(action_value)) { deb.low(`Running ${action_value} application`); let app =
//             bot_app[action_value]; app(); } }
/*
*
* If im running in a childProcess, prepare child Process new config
*
*
* */






