const {BaseMonitor, Pro, sleep, gen_timestamp} = require('../bot_thread');
const axios = require('axios');
const path = require('path');
const {parentPort, workerData} = require('worker_threads');

(async () => {

    class Amazon {
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

