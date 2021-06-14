require('dotenv').config();
const dbug = require('./debug');
let debug = new dbug(process.env.DEBUG_LEVEL);
let ports = {
  http: process.env.HTTP_PORT,
  https: process.env.HTTPS_PORT
}

//ENVIRONMENT
let environments = {};
environments.dev = {'name': 'dev', 'id': 0, 'buy_product': false,};
environments.prod = {'name': 'prod', 'id': 1, 'buy_product': true,};
let env = process.env.ENV === 'none' && !environments.hasOwnProperty(process.env.ENV) ? environments.dev : environments[process.env.ENV];

//ACTION_ARRAY


// TIMESTAMP
let timestamp = new Date().getTime();


module.exports = {
  env: env,
  environments: environments,
  timestamp: timestamp,
  deb: debug,
  ports,
};