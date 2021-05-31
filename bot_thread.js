const webhook = require('webhook-discord');
const axios = require('axios');
const {timestamp, proxies, env, deb} = require('./lib/config');
const readline = require('readline-sync');

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// const { proxyRequest } = require('puppeteer-proxy');
const http = require('http');
const { Worker } = require('worker_threads');

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


class BotApp {
    constructor() {
    }

    app() {
        return 'instance';
    }

    static run_monitor(bot, bot_name='amazon', timestamp=null, callback=null) {
        // const bot = bots[i];
        const monitor_init = `./bots/monitor.js`;
        bot_name = bot_name.toLowerCase();
        const products_ids = bot["product_ids"];
        if (bot["is_prod"] === true && products_ids.length) {
            const delay = Productivity.delay_math(bot["delays"], (Math.pow(products_ids.length, 2)));
            // Setting the bot product number and the ODIN executing product number.
            let prod_num = 1, ex_prod_num = 1;
            // Loop through products in each monitor and call each monitor task.bat object
            for (let product_id in products_ids) {
                let pid = products_ids[product_id];
                if (bot.hasOwnProperty("product_id_type")) {
                    setTimeout(function() {
                        let product_identification = typeof pid === "object" ? pid.id : pid;
                        deb.log(`The ${i} # ${prod_num} monitor will run product id ${product_identification}`);
                        let workData = {bot, pid, delay, prod_num, bot_name};
                        // // console.log(config, bot, pid, prod_num, timestamp);
                        const port = new Worker(require.resolve(monitor_init), {
                            workerData: workData,
                        });
                        prod_num++;
                        deb.high(`Product number is ${prod_num} executed at ${Productivity.ts(timestamp)}s into script`)
                    }, 3000 * ex_prod_num);
                    ex_prod_num++;
                    deb.med(``)
                } else {
                    deb.med(`The ${bot_name} monitor is not configured`);
                }
            }
        }
        // set object with bot_options
    }
}



// remember to call asynchronously
function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds*1000));
}

class Thor {

    _bots = null;
    _timestamp = null;
    _proxy = null;
    _env = null;

    constructor(bot_args) {
        this._timestamp = timestamp;
        this._proxies = proxies;
        this._env = env;
        this._proxy = bot_args.hasOwnProperty("proxy") ? bot_args["proxy"] : "127.0.0.1";
        this.bot_name = bot_args['bot_name'];
        this.bot_args = bot_args;
        this.hook = new Discorder('')
    }

    is_debug() {return env.id <= 0;}
    is_prod() {return !this.is_debug();}
    ts() {return Productivity.ts(this._timestamp);}
    async run() {await this.run_init();}
    async run_init() {console.log("Run init not configured");}
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

}

class Productivity {

    static async waitminute(minutes) {await sleep(60*minutes);}
    static ts(timestamp=null) {return timestamp===null ? new Date().getTime() : (new Date().getTime()-timestamp)/1000;}
    static random_int(min, max) {return Math.floor(Math.random() * (max - min + 1) + min)}
    static random_num(multiplier=1, integer=true) {
        return integer ? Math.floor(Math.random() * multiplier) : Math.random() * multiplier;
    }
    static random_int_size(n) {
        // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.
        let add = 1, max = 12 - add;
        if ( n > max ) {
            return Productivity.random_int_size(max) + Productivity.random_int_size(n - max);
        }
        max        = Math.pow(10, n+add);
        let min    = max/10; // Math.pow(10, n) basically
        let number = Productivity.random_num(min, max);
        return ("" + number).substring(add);
    }
    static non_null_answer() {

    }


    static generate_worker(file, workData, error = null) {
        const port = new Worker(file, {workerData: workData});
        if (error !== null) {
            // Set port events if applicable
            port.on("error", (e) => console.error(e));
        }
        return port;
    }


    static choosable_list(choices, question='What choice do you pick?') {
        let temp_arr = [];
        for (let [key, value] of Object.entries(choices)) {
            console.log(`[${key}]: ${value}`);
            temp_arr.push(value);
        }
        let answer = null;
        while (answer === null) {
            let response = readline.question(question);
            if (response <= temp_arr.length - 1) {
                answer = temp_arr[response];
            } else {
                console.log('Choice is not available');
            }
        }
        return answer;
    }

    // static selectable_list(choices, question='Which selections?') {
    //     let temp_arr = [];
    //     for (let [key, value] of Object.entries(choices)) {
    //         console.log(`[${key}]: ${value}`);
    //         temp_arr.push(value);
    //     }
    //     let answer = null;
    //     while (answer === null) {
    //         let response = readline.question(question);
    //         if (response <= temp_arr.length - 1) {
    //             answer = temp_arr[response];
    //         } else {
    //             console.log('Choice is not available');
    //         }
    //     }
    //     return answer;
    // }

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

    static browser_args(proxy_name=null) {
        let alwaysArgs;
        if (proxy_name) {
            alwaysArgs = [
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
        } else {
            alwaysArgs = [
                '--no-sandbox',
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
        }

        return alwaysArgs;
    }

    static async browser_launch(headless=false, proxy=null) {
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
        return await puppeteer.launch(options);
    }

    static async browser_init(callback=null, headless=false, proxy=null) {
        let browser = Productivity.browser_launch(headless, proxy);
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
    static proxy_id(proxy_num, proxy_list) {
        let proxy_id = proxy_num-1;
        // Minus one to find the correct key of the proxy array
        // Using the proxy length, if the proxy number is still greater than the proxy array length, then keep subtracting the length of the array until a valid key is set
        let proxy_length = proxy_list.length;
        if (proxy_id > proxy_length) {
            while (proxy_id > proxy_length) {proxy_id = proxy_id - proxy_length;}
        }
        return proxy_id < 0 || proxy_id > proxy_length ? null : proxy_list[proxy_id];
    }


}




module.exports = {
    Pro: Productivity,
    Thor,
    Discorder,
    BotApp,
    env,
    sleep,
};