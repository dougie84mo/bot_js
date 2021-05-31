const fs = require('fs');
require('dotenv').config();
const dbug = require('./debug');
let debug = new dbug(process.env.DEBUG_LEVEL);
const asset = (file_name) => `${__dirname}\\..\\assets\\${file_name}`

//ENVIRONMENT
let environments = {};
environments.dev = {'name': 'dev', 'id': 0, 'buy_product': false,};
environments.prod = {'name': 'prod', 'id': 1, 'buy_product': true,};
let env = process.env.ENV === 'none' && !environments.hasOwnProperty(process.env.ENV) ? environments.dev : environments[process.env.ENV];

//PROXIES
let proxies = [];

let proxy_data = fs.readFileSync(asset('proxies.txt'),{encoding:'utf8'});
proxy_data = proxy_data.toString().split("\n");
for (let proxy_row in proxy_data) {
  let proxy = proxy_data[proxy_row].replace('\r', '').split(':')
  let proxy_info= {
    'proxy_server': proxy[0]+':'+proxy[1],
    'user_pass': proxy[2]+":"+proxy[3],
    'ip': proxy[0],
    'port': proxy[1],
    'username': proxy[2],
    'password': proxy[3],
  };
  proxy_info['proxy'] = proxy_info['user_pass']+'@'+proxy_info['proxy_server'];
  debug.high(proxy_info);
  proxies.push(proxy_info);
}
debug.high(`Init proxy list: ${proxies}`);
//ACTION_ARRAY

// BOTS
let bots = require(asset('bots.json'));

// TIMESTAMP
let timestamp = new Date().getTime();


module.exports = {
  proxies: proxies,
  env: env,
  environments: environments,
  bots: bots,
  timestamp: timestamp,
  deb: debug,
};