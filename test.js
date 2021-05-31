const readline = require("readline-sync");
const {BotApp, Pro} = require("./bot_thread");
const {profile_keys} = require("./tech_boy")

class BotTestApp {
    static test_app () {
        let app = BotApp.app();
    }
    static test_monitors (bots) {
        for (let [i, bot] in Object.entries(bots)) {
            // const bot = bots[i];
            // set object with bot_options
        }
    }

    static test_checkout (bots) {
        for (let [i, bot] in Object.entries(bots)) {
            // const bot = bots[i];
            // set object with bot_options
        }
    }

    static test_raffles () {
        let raffle = null;
        while (raffle === null) {
            let answer = readline.question("");
        }
        let raffle_times = null;
    }

    static test_profiles() {
        console.log('Start profile test');
        // Will be tabs in the app
        let action = Pro.choosable_list(profile_keys, "What type of profile action?");
        //
        console.log(bots);

    }
}

module.exports = {BotTestApp}