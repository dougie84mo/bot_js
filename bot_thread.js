const webhook = require('webhook-discord');
const axios = require('axios');
const {timestamp, bots, proxies, env} = require('./lib/config');

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// const { proxyRequest } = require('puppeteer-proxy');
const http = require('http');
const { Worker } = require('worker_threads');



class Productivity {

    static ts(timestamp=null) {return timestamp===null ? new Date().getTime() : (new Date().getTime()-timestamp)/1000;}
    static random_int_between(min, max) {return Math.floor(Math.random() * (max - min + 1) + min)}
    static random_int_exclusive_between(min, max) {return Math.floor(Math.random() * (max - min) + min)}
    static random_int_number(n) {
        // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.
        let add = 1, max = 12 - add;
        if ( n > max ) {
            return Productivity.random_int_number(max) + Productivity.random_int_number(n - max);
        }
        max        = Math.pow(10, n+add);
        let min    = max/10; // Math.pow(10, n) basically
        let number = Productivity.random_int_between(min, max);
        return ("" + number).substring(add);
    }

    static generate_worker(file, workData, error = null) {
        const port = new Worker(require.resolve(file), {workerData: workData,});
        if (error !== null) {
            // Set port events if applicable
            port.on("error", (e) => console.error(e));
        }
        return port;
    }

    static delay_math(delays, multiplier) {
        let delay=60;
        if (typeof delays === "number") {
            delay = Math.ceil(delays);
        } else if (typeof delays === "object") {
            if (delays.hasOwnProperty("daily")) {
                delay = Math.ceil(86400/delays["daily"]) * multiplier;
            } else if (delays.hasOwnProperty("hour")) {
                delay = Math.ceil(3600/delays["hour"]) * multiplier;
            } else if (delays.hasOwnProperty("minute")) {
                delay = Math.ceil(60/delays["minute"]) * multiplier;
            }
        }
        return delay;
    }

    static format_url(url_str, params) {
        for (let i = 0; i < params.length; i++) {
            url_str = url_str.replace("%X", params[i]);
        }
        return url_str;
    }

    static proxy_id(proxy_num, proxy_list) {
        let proxy_id = proxy_num;
        proxy_id--;
        // Minus one to find the correct key of the proxy array
        // Using the proxy length, if the proxy number is still greater than the proxy array length, then keep subtracting the length of the array until a valid key is set
        let proxy_length = proxy_list.length;
        if (proxy_id > proxy_length) {
            while (proxy_id > proxy_length) {
                proxy_id = proxy_id - proxy_length;
            }
        }
        return proxy_id < 0 || proxy_id > proxy_length ? null : proxy_list[proxy_id];
    }

    static async browser_init(callback=null, headless=false, proxy=null) {
        let proxy_name = proxy === null ? '127.0.0.1:9876' : proxy['proxy_server'];
        let alwaysArgs = [
            '--no-sandbox',
            '--proxy-server=http://'+proxy_name,
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-infobars',
            '--disable-automation',
            '--allow-insecure-localhost',
            '--disable-accelerated-2d-canvas',
            '--start-maximized',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--lang=en-US,en;q=0.9',
            '--ignore-certificate-errors'
        ];
        let options = {
            headless: headless,
            ignoreHTTPSErrors: true,
            defaultViewport: null,
            args: alwaysArgs,
        };
        if (proxy) {
            // TODO: Apply puppeteer stealth config and auto captcha where necessary

            await puppeteer.use(StealthPlugin());
        }
        const browser = await puppeteer.launch(options);
        if (callback === null) {
            return browser;
        } else {
            const page = await browser.newPage();
            if (proxy) {
                let username = proxy['username'];
                let password = proxy['password'];
                await page.authenticate({username, password})
            }
            // console.log('Run callable');
            await callback(page);
            // console.log('Callable ran');
            await sleep(60);
            await browser.close();
        }
    }
}

class Thor {

    _bots = null;
    _timestamp = null;
    _proxies = null;

    constructor(bot_args) {
        this._bots = bots;
        this._timestamp = timestamp;
        this._proxies = proxies;
        this.bot_name = bot_args['lc_bot']
        this.bot_args = bot_args;
    }

    is_debug() {return env.id <= 0;}
    is_prod() {return !this.is_debug();}
    ts() {return Productivity.ts(this._timestamp);}
}

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
        let proxy = Productivity.proxy_id(proxy_id, this.conf['proxies'])
        let is_headless = this.is_prod();
        await Productivity.browser_init(callback, is_headless, proxy);
    }


    get_item_id() {
        return typeof(this.item_id) === 'object' && this.item_id.hasOwnProperty('id') ? this.item_id.id : this.item_id;
    }



    rnum(multiplier=1, integer=true) {
        let num = Math.random() * multiplier;
        return integer ? Math.floor(num) : num;
    }

    run_init() {
        // console.log(`Awaited product ${this.get_item_id()} in ${this.get_timestamp()} seconds`);
        this.run();
    }

    async minute_sleep(minutes) {
        await sleep(60*minutes);
    }

    async api_product_key_json_response(url) {
        return new Promise((resolve, reject) => {
            axios.get(url)
            .then(response => {
                // console.log(response);
                if (response.status !== 200) {
                    this.hook.discordup("NOT URL", "DEVON THE BOT STOPPED WORKING, COME REFRESH ME", "OTher URL");
                }
                const jsonstring = response.data;
                resolve(jsonstring);
            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }

    generate_product_url(params) {
        return new Promise(resolve => {
            const url_str = Productivity.format_url(
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

class BaseBotTask extends Thor {
    constructor(bot_args) {
        super(bot_args);
        this.account = bot_args['account'];
        this.product_url = bot_args['product_url'];
        this.proxy = bot_args['proxies'];
    }

    async run_init() {
        await Productivity.browser_init(this.proxy, null, this.run);
    }
}




class Discorder {
    constructor(hook_url) {
        this.Hook = new webhook.Webhook(hook_url);
    }

    discordup(url, productName, productUrl, description=null, image=null, tn=null) {
        let msg = new webhook.MessageBuilder()
            .setTitle(productName)
            .setText(productUrl)
            .setDescription(`[CLICK HERE TO ADD TO CART](${url})`);

        if (description !== null) { msg.addField("Description: ", description); }
        if (image !== null) {msg.setImage(image);}
        if (tn !== null) {msg.setThumbnail(tn);}
        msg.setFooter("Created by DnD network", "https://image.ibb.co/gq7xgT/blackyzylogo.png")
        this.Hook.send(msg);
    }

    discord_async(url, productName, productUrl, description=null, image=null, tn=null) {
        return new Promise(resolve => {
           this.discordup(url, productName, productUrl, description, image, tn)
        })
    }
}

//



// remember to call asynchronously
function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds*1000));
}



module.exports = {
    Pro: Productivity,
    Thor: Thor,
    Discorder: Discorder,
    BaseMonitor: BaseMonitor,
    BaseBotTask: BaseBotTask,
    sleep,
    gen_timestamp
};