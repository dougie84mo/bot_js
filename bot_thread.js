const webhook = require('webhook-discord');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const puppeteer = require('puppeteer');
const { proxyRequest } = require('puppeteer-proxy')
const http = require('http');
const { parentPort } = require('worker_threads');



class Productivity {

    static initialize_configuration() {
        const current_asset_path = path.join(__dirname, 'assets');
        const asset_files = fs.readdirSync(current_asset_path);
        console.log("Stack starting with files " + asset_files.join(" - "));
        let opts = {};

        for (let file of asset_files) {
            let filetype = file.includes('txt') ? '.txt' : (file.includes('csv') ? '.csv' : '.json');
            if (file.includes('txt')) {
                let data = fs.readFileSync(`.\\assets\\${file}`,{encoding:'utf8'});
                let actual_proxy_data = [];
                data = data.toString().split("\n");
                for (let prox in data) {
                    let proxy = data[prox].replace('\r', '').split(':')
                    let proxy_info= {
                        'proxy_server': proxy[0]+':'+proxy[1],
                        'user_pass': proxy[2]+":"+proxy[3],
                        'ip': proxy[0],
                        'port': proxy[1],
                        'username': proxy[2],
                        'password': proxy[3],
                    };

                    proxy_info['whole'] = proxy_info['user_pass']+'@'+proxy_info['proxy_server'];
                    // console.log(proxy_info);
                    actual_proxy_data.push(proxy_info);
                    // console.log(actual_proxy);
                }
                // console.log('Using proxies', actual_proxy_data);
                opts[file.replace('.txt', '')] = actual_proxy_data;

            } else if (file.includes('json')) {

                opts[file.replace('.json', '')] = require(`.\\assets\\${file}`);
            }
        }
        return opts;
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
            // const ph = `%${placeholders[i]}`;
            url_str = url_str.replace("%X", params[i]);
        }
        return url_str;
    }

}

class BaseMonitor {

    conf = null;
    bconf = null;
    item_id = null;
    monitor_counter=0;

    constructor(bot_args) {
        this.conf = bot_args['config'];
        this.bconf = bot_args['bot'];
        this.product_type = this.bconf["product_id_type"].split('_');
        this.item_id = bot_args["pid"];
        this.delay = bot_args["delay"];
        this.bot_args = bot_args;
        if (this.bconf.hasOwnProperty("paths") && this.bconf["paths"].hasOwnProperty("webhook")) {
            this.hook = new Discorder(this.bconf["paths"]["webhook"]);
        }
    }

    async browser_init(callback, viewport=null,  args=[]) {
        // '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
        let proxy_id = this.bot_args['prod_num'];
        console.log(proxy_id);
        let proxy_length = this.conf['proxies'].length;
        if (proxy_id > proxy_length) {
            while (proxy_id > proxy_length) {
                proxy_id = proxy_id-proxy_length;
            }
        }
        proxy_id--;
        console.log(proxy_id);
        let proxy = proxy_id < 0 || proxy_id > proxy_length ? null : this.conf['proxies'][proxy_id];
        console.log(proxy);
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
        let is_headless = this.is_prod();

        let options = {
            headless: is_headless,
            ignoreHTTPSErrors: true,
            defaultViewport: viewport,
            args: [].concat(args, alwaysArgs),
        };
        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        if (proxy) {
            let username = proxy['username'];
            let password = proxy['password'];
            await page.authenticate({username, password})
        }
        if (this.is_debug()) {
            await page.goto('https://whatismyipaddress.com/');
            await sleep(3);
        }
        await callback(page);
        await sleep(60);
        await browser.close();
        // if (product) {
        //     options['product'] = 'firefox';
        // }
        // console.log(options);
        // if (proxy) {
        //     await page.setRequestInterception(true);
        //     let proxy_name = `http://${proxy['whole']}`;
        //     await page.on('request', (request) => {
        //         proxyRequest({page, proxyUrl: proxy_name, request});
        //     });
        // }
    }

    get_item_id() {
        return typeof(this.item_id) === 'object' && this.item_id.hasOwnProperty('id') ? this.item_id.id : this.item_id;
    }

    get_timestamp() {
        return gen_timestamp(this.bot_args["timestamp"]);
    }

    rnum(multiplier=1, integer=true) {
        let num = Math.random() * multiplier;
        return integer ? Math.floor(num) : num;
    }

    run_init() {
        console.log(`Awaited bot ${this.get_item_id()} in ${this.get_timestamp()} seconds`);
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
        const url_str = this.bconf["paths"]["product_url"]
        return Promise.resolve(url_str);
    }



    is_debug() {return this.conf["opts"]["debug"];}
    is_prod() {return !this.is_debug();}

    async carting_callback() {
        // get accounts or
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
class Loki {
    constructor() {
    }
}


// remember to call asynchronously
function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds*1000));
}

function gen_timestamp(timestamp) {
    return (new Date().getTime()-timestamp)/1000;
}

module.exports = {
    Productivity: Productivity,
    Discorder: Discorder,
    BaseMonitor: BaseMonitor,
    sleep,
    gen_timestamp
};