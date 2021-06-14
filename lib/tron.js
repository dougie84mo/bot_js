const { env, deb, ports } = require('./config');
const { command_task_list } = require('./command');
// const { Pro } = require('.././tech_boy');
// const { BotTestApp } = require('../test');
const express = require('express');
const app = express();


app.route('/')
    .get(function (req, res) {
            res.send('Server is on')
    })

app.route('/something')
    .get(function (req, res) {
            res.send('Something is happening')
    })


app.listen(ports.http, err => {
   if (err) {
       return console.error("Express Error", err);
   }
   console.log(`Listening on port ${ports.http}`);
});

// if (env.id === 0) { console.log('DEV MODE'); const action_process = Pro.choosable_list(command_task_list, "What would
//     you like to run? "); deb.med(action_process); test_app_feature(action_process); function
//     test_app_feature(action_value) { deb.med(action_value); let bot_app = { bot_app: () => {BotTestApp.test_app();},
//             profiles: () => {BotTestApp.test_profiles();}, monitor: () => {BotTestApp.test_monitors();}, raffle: ()
//             => {BotTestApp.test_monitors();}, checkout: () => {BotTestApp.test_app();}, }; deb.med(bot_app); if
//         (bot_app.hasOwnProperty(action_value)) { deb.low(`Running ${action_value} application`); let app =
//             bot_app[action_value]; app(); } }
/*
*
* If im running in a childProcess, prepare child Process new config
*
*
* */






