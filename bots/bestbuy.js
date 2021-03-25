const {BaseMonitor, sleep, gen_timestamp} = require('../bot_thread');
const axios = require('axios');
const path = require('path');
const {parentPort, workerData} = require('worker_threads');

(async () => {
    
    class BestBuy extends BaseMonitor {
    
        async run() {

            const url = await this.generate_product_url([this.item_id, this.bconf["api_token"]]);
            // console.log(url);

            const product = await this.api_product_key_json_response(url);
            // console.log(product);
            if (product.hasOwnProperty("orderable") && product['orderable'] !== 'SoldOut') {
                this.hook.discordup(product["addToCartUrl"], product["name"], product["url"])
                console.log(`Item in Stock: ${product["name"]}`);
                await this.minute_sleep(10);
                console.log(`Item monitor refreshed ${product["name"]}`)
            } else if (product.hasOwnProperty("name")) {
                    console.log(`Not found: ${product["name"]}`);
                } else {
                        console.log('Hello');
                    }
                    console.log(product);

            this.monitor_counter++;
            await sleep(this.delay);
            console.log(`Product from best buy awaited ${gen_timestamp(this.bot_args["timestamp"])}`);
        }
    }
    
    
    const b = new BestBuy(workerData);
    await b.run_init();
    console.log('Creating bot');
    // await sleep(workerData["delay"] * workerData["prod_num"]);

    // parentPort.postMessage(workerData);
})();

