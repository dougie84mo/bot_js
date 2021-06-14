const {BaseBotTask, sleep, gen_timestamp, Pro} = require('../../bot_thread');
const axios = require('axios');
const path = require('path');
const {parentPort, workerData} = require('worker_threads');

(async () => {
    
    class AmazonTask extends BaseBotTask {

        async run(page) {
            // get the product page
            await page.goto(this.product_url);
            await page.waitForSelector("#buybox");

        }

        async static check_login(page, profile) {
            const login_html = ["#nav-link-accountList", "#nav-link-accountList-nav-line-1"];
            const span_name = await page.$(login_html[1]);
            await page.waitForSelector(`${login_html[0]}, ${login_html[1]}`);


            const is_not_logged_in = await page.evaluate(span => {
                let span_text = span.innerText;
                return span_text === "Hello, Sign In";
            }, span_name);

            if (is_not_logged_in) {
                await page.click(login_html[0]);
                await page.waitForSelector("#ap_email");
                await page.type("#ap_email", profile["username"]);
                await page.click("#continue");

            }

        }

        async static check_password_page(page, profile, bypass=false) {
            let password_field;
            if (bypass) {
                await page.waitForSelector("#ap_password");
                password_field = true;
            } else {
                await sleep(.5);
                password_field = await page.$("#ap_password");
            }


            if (password_field !== null) {
                await page.type("#ap_password", profile["password"]);
                // await page.click("#continue");
                await page.click("#signInSubmit");
            }
        }


        async add_to_cart_checkout(page, profile) {

        }

        async static check_if_available(page) {
            return await page.$("#add-to-cart-button");
        }

        async check_for_password_page(page, profile) {
            let password_field = await page.$("#ap_password");
            if (password_field) {
                await password_field.type("#ap_password", profile["password "]);
            }
        }
    }
    let b = new AmazonTask(workerData);
    await b.run_init();
})();

