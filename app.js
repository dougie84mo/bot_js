const express = require('express');
const http = require('http');
const pupp = require('puppeteer');
const path = require('path');
const fs = require('fs');

let opts = {};
fs.readdir(path.join(__dirname, 'assets'), function (err, files) {
    if (err) throw err;
    
    for (let file of files) {
        let f = fs.readFileSync(`.\\assets\\${file}`)
        opts[file.replace('.json', '')] = JSON.parse(f)
        
        console.log(file)
    }
    console.log(opts)
})

const app = express();
const port = 3000;

(async()=>{
    const browser = await puppeteer.launch()
    

})