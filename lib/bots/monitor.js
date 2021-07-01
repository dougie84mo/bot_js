const {Discorder, Pro, Thor, deb, sleep} = require('../bot_thread');
const axios = require('axios');
const path = require('path');
const {parentPort, workerData} = require('worker_threads');

const monitors = {};

class BaseMonitor extends Thor {

    item_id = null;
    monitor_counter=0;

    constructor(bot_args) {
        super(bot_args);
        console.log(this);
        // this.product_type = this._bots["product_id_type"].split('_');
        this.item_id = bot_args["pid"].split("___");
        this.delay = bot_args["delay"];
        if (this._bots.hasOwnProperty("paths") && this._bots["paths"].hasOwnProperty("webhook")) {
            this.hook = new Discorder(this._bots["paths"]["webhook"]);
        }
    }

    async browser_init(callback=null, enable_recaptcha=false) {
        // Proxy id starts as the bot product number
        let proxy_id = this.bot_args['prod_num'];
        let proxy = Pro.proxy_id(proxy_id, this._proxies);
        let is_headless = this.is_prod();
        await Pro.browser_init(callback, is_headless, proxy);
    }


    get_item_id() {
        return typeof(this.item_id) === 'object' && this.item_id.hasOwnProperty('id') ? this.item_id.id : this.item_id;
    }


    generate_product_url(params) {
        return new Promise(resolve => {
            const url_str = Pro.format_url(
                this._bots["paths"]["product_url"],
                params
            );
            resolve(url_str);
        })
    }

    async carting_callback() {/* get accounts or*/}


    get item_id() {return this.item_id;}
    product_url(merge_arr=[]) {return this.generate_product_url([].concat([this.item_id[0]], merge_arr));}


}

class BestBuy extends BaseMonitor {

    async run() {

        const url = await this.generate_product_url([this.item_id[0], this.bconf["api_token"]]);
        // console.log(url);

        const product = await this.api_product_key_json_response(url);
        // console.log(product);
        if (product.hasOwnProperty("orderable") && product['orderable'] !== 'SoldOut') {
            this.hook.discordup(product["addToCartUrl"], product["name"], product["url"]);
            //SETUP ACCOUNTS FOR BEST BUY
            console.log(`Item in Stock: ${product["name"]}`);
            await this.minute_sleep(10);
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

    async product_url() {
        return this.generate_product_url([this.item_id[0]])
    }
}

class Amazon extends BaseMonitor {

    async run_init() {
        // let accounts = self.bconf['accounts'];

        let accounts = {};
        let self = this;
        let product_url = await this.product_url();
        await this.browser_init(
            async function (page) {
                if (self.is_debug()) {
                    await page.goto('https://whatismyipaddress.com/');
                    await sleep(10);
                    await page.goto('https://bot.sannysoft.com/');
                    await sleep(10);
                }
                console.log("Test after debug");
                // get the product page
                await page.goto(product_url);
                await page.waitForSelector("#buybox");
                await sleep(.5);
                console.log("Test after buy box");
                let file_name = `./bot_${self.bot_name}.js`
                // loop1:
                while (true) {
                    let product_addtocart = await page.$("#add-to-cart-button");
                    deb.med('');

                    if (product_addtocart) {
                        console.log(`Product ${self.item_id} found!`);
                        // console.log(proxies);
                        for (let [key, account] of Object.entries(accounts)) {
                            // let proxy = Pro.proxy_id(key, proxies);
                            //
                            // // TODO: Some kind of randomizing timing here but not much
                            // let task_config = {proxy, account};
                            // let worker = Pro.generate_worker(file_name, {...self.bot_args, ...task_config});
                            // // Open thread
                        }
                        await sleep(60*20);
                    } else {
                        let r = Math.random();
                        if (r < .75) {r += .75;}
                        await sleep(60*r);
                        await page.evaluate(() => location.reload());
                        await sleep(3*r);
                        console.log(`Page for product ${self.item_id} reloaded after ${gen_timestamp(timestamp)} seconds`);
                        // await page.waitForSelector("#buybox");
                    }
                }
            }
        );
    }
}

(async () => {

    let b = {};
    b['amazon'] = () => new Amazon(workerData);
    b['best_buy'] = () => new BestBuy(workerData);
    await b.run();
})();

