// const { exit } = require('process');
// const cluster = require('cluster');
const { Worker, workerData, isMainThread } = require('worker_threads');
const { Productivity, gen_timestamp} = require('./bot_thread');

const config = Productivity.initialize_configuration();
const bot_keys = Object.keys(config["bots"]);
const timestamp = new Date().getTime();

for (let i in bot_keys) {
    const bot_key = bot_keys[i];
    const bot = config["bots"][bot_key];
    // check if in debug is true
    // if is debug mode
        // only get test_products
        // also do not check out
        // do not check for
    const products_ids = bot["product_ids"];
    if (bot["is_prod"] === true && products_ids.length) {
        // console.log(bot);'
        const delay = Productivity.delay_math(bot["delays"], (Math.pow(products_ids.length, 2)));
        // console.log(delay);
        const lc_bot = bot_key.toLowerCase();
        const bot_file = `./bots/${lc_bot}.js`;
        let prod_num = 1, ex_prod_num = 1;
        // call the monitor object and start running
        for (let product_id in products_ids) {
            let pid = products_ids[product_id];
            if (bot.hasOwnProperty("product_id_type")) {

                setTimeout(function() {
                    let product_identification = typeof pid === "object" ? pid.id : pid;
                    console.log(`The ${bot_key} # ${prod_num} monitor will run product id ${product_identification}`);
                    // console.log(config, bot, pid, prod_num, timestamp);
                    const port = new Worker(require.resolve(bot_file), {
                        workerData: {config, bot, pid, delay, prod_num, timestamp},
                    });
                    // console.log(gen_timestamp(timestamp));
                    // port.on("message", (data) => console.log(`Worker data running for bot ${lc_bot} product sku:${data['product_id']} `));
                    port.on("error", (e) => console.log(e));
                    // port.on("exit", (code) => console.log(`Exit code ${code} from bot ${lc_bot}`));
                    prod_num++;
                }, 3000 * ex_prod_num);
                ex_prod_num++;
            } else {
                console.info(`The ${i} monitor is not configured`);
            }
        }
    }
    // set object with bot_options
}

