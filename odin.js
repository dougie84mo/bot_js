// const { exit } = require('process');
// const cluster = require('cluster');fff
// const readline = require('readline-sync');
const { Worker } = require("worker_threads");
const { Pro, BotApp, BotTestApp } = require('./bot_thread');
const { bots, env, deb} = require('./lib/config');
const { command_task_list, task_value_id } = require('./lib/command');
if (env.id === 0) {
    console.log('DEV MODE')
    const action_process = Pro.choosable_list(command_task_list, "What would you like to run? ");
    let action_id = task_value_id[action_process];
    deb.med(action_process);
    function tcomp(value) {
        deb.log(action_process);
        return task_value_id[value] === action_process;
    }

    function test_app_feature(action_value) {
        let bot_app = {};
        bot_app['bot_app'] = () => {BotTestApp.test_app();};
        bot_app['monitor'] = () => {BotTestApp.test_monitors();};
        bot_app['checkout'] = () => {BotTestApp.test_checkout();};
        bot_app['raffle'] = () => {BotTestApp.test_raffles();};
        bot_app['account_generator'] = () => {BotTestApp.test_monitors();};
        bot_app['harvest'] = () => {BotTestApp.test_monitors();};
        bot_app['profiles'] = () => {BotTestApp.test_profiles();};
        if (bot_app.hasOwnProperty(action_value)) {
            let app = bot_app[action_value];
            app();
        }
    }
    test_app_feature(action_id);
} else if (env.id === 1) {

    function app_feature(action_value) {
        let bot_app = {};
        bot_app['bot_app'] = () => {BotApp.test_app();};
        bot_app['monitor'] = () => {BotApp.test_monitors();};
        bot_app['checkout'] = () => {BotApp.test_checkout();};
        bot_app['raffle'] = () => {BotApp.test_monitors();};
        bot_app['account_generator'] = () => {BotApp.test_monitors();};
        bot_app['harvest'] = () => {BotApp.test_monitors();};
        bot_app['profiles'] = () => {BotApp.test_monitors();};
    }
    test_app_feature(action_id);
}






