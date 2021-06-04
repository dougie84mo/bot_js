// const { exit } = require('process');
// const cluster = require('cluster');
// const { Worker } = require("worker_threads");
const { BrowserWindow, app } = require('electron');
const path = require('path');
// const { Pro, BotApp} = require('./bot_thread');
// const { BotTestApp } = require('./test');
// const { bots, env, deb} = require('./lib/config');
// const { command_task_list } = require('./lib/command');


// app.on('ready', () => { const win = new BrowserWindow({ width: 1200, height: 800, backgroundColor: "#7ccfeb",
//         webPreferences: { nodeIntegration: false, worldSafeExecuteJavaScript: true, contextIsolation: true } });
//     win.loadFile('index.html'); });

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: "#7ccfeb",
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true
        }
    });

    win.loadFile('index.html');
}

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
})

app.whenReady().then(createWindow)

// if (env.id === 0) {
//     console.log('DEV MODE');
//     const action_process = Pro.choosable_list(command_task_list, "What would you like to run? ");
//     deb.med(action_process);
//     test_app_feature(action_process);
//     function test_app_feature(action_value) {
//         deb.med(action_value);
//         let bot_app = {
//             bot_app: () => {BotTestApp.test_app();},
//             profiles: () => {BotTestApp.test_profiles();},
//             monitor: () => {BotTestApp.test_monitors();},
//             raffle: () => {BotTestApp.test_monitors();},
//             checkout: () => {BotTestApp.test_app();},
//         };
//
//         deb.med(bot_app);
//         if (bot_app.hasOwnProperty(action_value)) {
//             deb.low(`Running ${action_value} application`);
//             let app = bot_app[action_value];
//             app();
//         }
//     }
// } else if (env.id === 1) {
//
// }
//
/*
*
* If im running in a childProcess, prepare child Process new config
*
*
* */






