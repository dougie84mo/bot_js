const {BaseMonitor, Pro, sleep, gen_timestamp} = require('../bot_thread');
const axios = require('axios');
const path = require('path');
const {parentPort, workerData} = require('worker_threads');

(async () => {
    
    class Amazon extends BaseMonitor {

        async run() {
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
                    let timestamp = Pro.ts();
                    while (true) {
                        let product_addtocart = await page.$("#add-to-cart-button");

                        if (product_addtocart) {
                            let accounts = self.bconf['accounts'];
                            let proxies = self.conf['proxies'];
                            console.log(`Product ${self.item_id} found!`);
                            // console.log(proxies);
                            for (let [key, account] of Object.entries(accounts)) {
                                // let proxy = Productivity.proxy_id(key, proxies);
                                //
                                // // TODO: Some kind of randomizing timing here but not much
                                // let task_config = {proxy, account};
                                // let worker = Productivity.generate_worker(file_name, {...self.bot_args, ...task_config});
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


        async checkout(page, account) {

        }

        // let buybox = await page.$("#buybox");
        // let product_addtocart = page.evaluate((box) => {
        //     if (box.querySelector("#unqualifiedBuyBox_feature_div")) {
        //         return false;
        //     } else {
        //         let addtocart = box.querySelector("#add-to-cart-button");
        //     }
        // }, buybox);
        // if not available the direct child of this object will be
        //#unqualifiedBuyBox_feature_div
        // else
        // #qualifiedBuybox or #desktop_accordion
        // search for add to cart button

        async check_if_available(page) {
            return await page.$("#add-to-cart-button");
        }

        async check_for_password_page(page, profile) {
            let password_field = await page.$("#ap_password");
            if (password_field) {
                await password_field.type("#ap_password", profile["password "]);
            }
        }
    }
    let b = new Amazon(workerData);
    await b.run_init();
})();

