const discorder = require('./discord_hook');
const axios = require('axios');

// class ProductStatus {
//     constructor(delay)
// }

class BaseMonitor {
    constructor(bot_name, bot_options) {
        console.log(`Running monitor for ${bot_name}`)
        this.bot_name = bot_name;
        this.bot_options = bot_options;
        if (this.bot_options.includes("webhook")) {
            this.hook = new Discorder(this.bot_options["webhook"]);
        }

    }

    api_product_key_url(url) {
        const r = axios.get(url);
        console.log(r.status_code);
        if (r.status_code != 200) {
            this.hook.discordup("NOT URL", "DEVON THE BOT STOPED WORKING, COME REFRESH ME", "OTher URL");
        }
        jsonstring = r.text;
        return json.loads(jsonstring);
    }

    async delay_math() {
        const delays = this.bot_options["delays"];
        if (typeof delays == "number") {
            delay = Math.ceil(delays);
        } else if (delays.includes("daily")) {
            delay = Math.ceil(86400/delays["daily"]) * len(this.bot_options["product_ids"]);
        } else {
            delay = 1;
        }
        return delay;
    }

    async run_monitor() {
        const api_delay = await this.delay_math(),
            products = this.bot_options["product_ids"];
        var counter = 0;


        while (True) {

        }
    }

    async product_status(delay=1) {
        throw new Error("The Bot product status was never implemented. Please implement!")
    }

}

class BestBuy extends BaseBot {
    async product_status(delay) {
        
        await sleep()
    }
}

// remember to call asynchronously
function sleep(ms) {
    return new Promise(resolve => {setTimeout(resolve, ms)})
}

module.exports = {
    BestBuy: BestBuy,
}