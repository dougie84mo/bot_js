const fs = require('fs');
const path = require('path');
const lib_dir = path.
require('dotenv').config();
var environments = {};
//ENVIRONMENT
environments.dev = {
  'name': 'dev',
  'id': 0,
  'buy_product': false,
};
environments.prod = {
  'name': 'prod',
  'id': 1,
  'buy_product': true,
};

let env;
if (process.env.ENV === 'none') {
  env = false
} else {
  env = environments.hasOwnProperty(process.env.ENV) ? environments[process.env.ENV] : environments.dev;
}
//PROXIES
let proxies = [];

let proxy_data = fs.readFileSync(`..\\.\\assets\\proxies.txt`,{encoding:'utf8'});
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
  // console.log(proxy_info);
  proxies.push(proxy_info);
  // console.log(actual_proxy);
}
// BOTS
var bots = require('..\\assets\\bots.json');
// TIMESTAMP
var timestamp = new Date().getTime();

module.exports = {
  proxies: proxies,
  env: env,
  bots: bots,
  timestamp: timestamp
};