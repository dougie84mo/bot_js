const {BaseMonitor, Pro, Thor, gen_timestamp} = require('../bot_thread');
const axios = require('axios');
const path = require('path');
const {parentPort, workerData} = require('worker_threads');
const raffles = require('.\\..\\data\\raffles.json');


class Raffle extends Thor {
    constructor(bot_args) {
        super(bot_args);
    }

    async browser_init(callback=null, enable_recaptcha=false) {
        // Proxy id starts as the bot product number
        let proxy_id = this.bot_args['prod_num'];
        let proxy = Pro.proxy_id(proxy_id, this._proxies);
        let is_headless = this.is_prod();
        await Pro.browser_init(callback, is_headless, proxy);
    }

    async run_init() {
        await super.run_init();
        let self = this;
        await Pro.browser_init(async function (page) {

        });

    }
}


(async () => {
    let b = new Raffle(workerData);
    await b.run();
})();

