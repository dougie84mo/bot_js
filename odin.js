// const { exit } = require('process');
// const cluster = require('cluster');
import { Worker } from "worker_threads";

const { Pro } = require('./bot_thread');
const readline = require('readline-sync');
const { bots, timestamp } = require('./lib/config');
const dbug = require('./lib/debug');
const bot_keys = Object.keys(bots);

for (let i in bot_keys) {
    const bot_key = bot_keys[i];
    const bot = bots[bot_key];
    const products_ids = bot["product_ids"];
    if (bot["is_prod"] === true && products_ids.length) {
        const delay = Pro.delay_math(bot["delays"], (Math.pow(products_ids.length, 2)));
        const lc_bot = bot_key.toLowerCase();
        const bot_file = `./bots/monitor_${lc_bot}.js`;
        // Setting the bot product number and the ODIN executing product number.
        let prod_num = 1, ex_prod_num = 1;
        // Loop through products in each monitor and call each monitor task object
        for (let product_id in products_ids) {
            let pid = products_ids[product_id];
            if (bot.hasOwnProperty("product_id_type")) {

                setTimeout(function() {
                    let product_identification = typeof pid === "object" ? pid.id : pid;
                    dbug.log(`The ${bot_key} # ${prod_num} monitor will run product id ${product_identification}`);
                    let workData = {bot, pid, delay, prod_num, lc_bot};
                    // // console.log(config, bot, pid, prod_num, timestamp);
                    const port = new Worker(require.resolve(bot_file), {
                        workerData: workData,
                    });
                    prod_num++;
                    dbug.high(`Product number is ${prod_num} executed at ${Pro.ts(timestamp)}s into script`)
                }, 3000 * ex_prod_num);
                ex_prod_num++;
                dbug.med(``)
            } else {
                dbug.med(`The ${i} monitor is not configured`);
            }
        }
    }
    // set object with bot_options
}

