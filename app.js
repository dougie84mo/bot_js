const express = require('express');
const {app, BrowserWindow} = require('electron');
const http = require('http');
const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os')
const fs = require('fs');
const prompt = require('prompt-sync')({sigint: true});
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
// const webhook = require('webhook-discord');
const current_asset_path = path.join(__dirname, 'assets');
const asset_files = fs.readdirSync(current_asset_path);
console.log("Stack starting with files " + asset_files.join(" & "));
let opts = {};

for (let file of asset_files) {
    let f = require(`.\\assets\\${file}`);
    opts[file.replace('.json', '')] = f;
}
// console.log(opts);

const bots = Object.keys(opts["bots"]);
// let run_bots = [];
// console.log(run_bots.length);
// while (run_bots.length === 0) {
//     console.log(`Possible monitors available: ${bots.join(" -- ")} \n Comma separate (',') monitors or type 'all' to run all monitor`);
//     readline.question("Which bots do you want to run? ", command_list => {
//         if (command_list.toLowerCase().trim() === "all") {
//             run_bots.concat(bots);
//         } else if (command_list.trim() !== "") {
//             let monitor_str = command_list.split(","), monitor_temp = null;
//             monitor_str.forEach(element => {
//                 if (typeof(element) === "string" && run_bots.includes(element.trim())) {
//                     monitor_temp.push(element);
//                 }
//                 // TODO: create case where bots that were spell wrong or not available are console.logged
//             });
//             if (monitor_temp !== null) { run_bots.concat(monitor_temp); }
//         }
//     });
// }
let run_bots = [];
bots.forEach((bot, bot_info) => {
    console.log(bot)
    if (bot_info["is_prod"] === true) {
        run_bots.push(bot);
    }
})

console.log(`Following bots will try to run ${run_bots.join(",")}`)


run_bots.forEach(element => {
    const bot_params = opts["bots"][element];
    if (bot_params.includes("monitor_api_type") && bot_params["is_prod"] === true) {
        console.log(``);
    } else {
        console.info(`The ${element} monitor is not configured`)
    }
    // set object with bot_options
    // call the elements monitor object and start running
    
});

// maybe should initialize each task with bot options

// const port = 3000;
// (async ()=>{
//     console.log("Async Call")
//     const browser = await puppeteer.launch({header: false});
//     const loginPage = await browser.newPage();
//     await loginPage.goto()
//     console.log("Browser cal  l" + browser)



//     await browser.close()
// })