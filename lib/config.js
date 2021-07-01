require('dotenv').config();
const fs = require('fs');
// const path = require('path');


//ENVIRONMENT
let environments = {};
environments.dev = {'name': 'dev', 'id': 0, 'buy_product': false};
environments.admin = {'name': 'admin', 'id': 1, 'buy_product': true};
environments.prod = {'name': 'prod', 'id': 2, 'buy_product': true};
let env = process.env.ENV === 'none' && !environments.hasOwnProperty(process.env.ENV) ? environments.dev : environments[process.env.ENV];

// DEBUG
const DEBUG_LEVELS = {"none": -1, "comment": 0, "low": 1, "med": 2, "high": 3}

class dbug {
  __current_level

  constructor(debug_level) {
    this.__current_level = DEBUG_LEVELS[debug_level];
    console.log(`The debug level is: ${debug_level}`);
  }
  is_below_level(log_level=0, log_str='', callback) {
    if (this.__current_level >= log_level) {
      callback(log_str);
    }
  }
  always(log_str) {console.log(log_str);}
  log(log_str) {this.is_below_level(0, log_str, (str)=>{console.log(str)})}
  low(log_str) {this.is_below_level(1, log_str, (str)=>{console.info(str)})}
  med(log_str) {this.is_below_level(2, log_str, (str)=>{console.debug(str)})}
  high(log_str) {this.is_below_level(3, log_str, (str)=>{console.warn(str)})}
}

let debug = new dbug(process.env.DEBUG_LEVEL);

// TIMESTAMP
let timestamp = new Date().getTime();
let secretToken = null;
// TODO: Check if has admin access
fs.readFile("../cache/user_key.txt", (err, data) => {
  secretToken = err ? data : null;
});

let config = {
  env: env,
  timestamp: timestamp,
  deb: debug,
  TOKEN: secretToken
}

module.exports = {
  conf: config,
  ...config
};