// const { exit } = require('process');
// const cluster = require('cluster');
const { Worker, workerData, isMainThread } = require('worker_threads');
const {Productivity, gen_timestamp} = require('./bot_thread');

const timestamp = new Date().getTime();
// must check processes in parent process

class Thor {
    constructor(BotClass) {
        this.bot = BotClass;
    }
}


// create callback for checking out
    
