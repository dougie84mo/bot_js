const {Pro, env} = require('../bot_thread');
const { profile_generation, profile_keys } = require('../tech_boy');
const { workerData } = require('worker_threads');
const fs = require('fs');
const readline = require('readline-sync');


class Profiles {
    #profile_file= '../data/profiles';
    profiles;
    constructor() {
        let file = fs.readFileSync(this.#profile_file, {"encoding": "utf8"});
        this.profiles = JSON.parse(file);
    }

    project_list_names() {
        return Object.keys(this.profiles);
    }

    command_line_choices() {
        let key = Pro.choosable_list(this.project_list_names(), "Which list would you like to edit from? :");
        return this.profiles[key];
    }




}

class Import {
    constructor(bot, json, append = true, merge_current = true) {

    }

    init(bot) {
        let bots = {
            "Dashe": (json) => {
                return Import.Dashe(json)
            },
            "Stellar": (json) => {
                return Import.Stellar(json)
            },
        }
    }

    static Dashe(json) {

    }

    static Stellar(json) {

    }
}