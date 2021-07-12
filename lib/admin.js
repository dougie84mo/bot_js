const { conf } = require('./config');
const { Pro, DB } = require('./tech_boy');
const hat = require('hat');
// const {mongodb} = require('mongodb').M

// const readline = require('readline-sync');

//TODO: Only if in admin



let complete_action_list = {
    "Generate Keys": async function () {
        let amount_of_keys = Pro.choose_int([10], "How many keys to generate?");
        let token_type = Pro.choosable_list({0: "User", 1: "Admin"}, "What Type of token would you like to generate\n");
        let token_name = Pro.choose_str([24], "What name is your tokens? \n")
        DB.init_std_connect(function (database) {
            database.collection('apiTokens');
            for (let i = 0; i < amount_of_keys; i++) {
                let gen_key = {
                    "apiKey": hat(256),
                    "name": token_name,
                    "issuedAt": new Date().getTime(),
                }
                database.insertOne(gen_key)
            }
        })
        console.log(`< Generated ${amount_of_keys} key(s)`)
    },
    "Initialize Super Admin": async function () {
        if (process.env.SUPER_ADMIN_PASSPHRASE === "drAOQCMcWc3UGYwca0oi32ESKvLwvA") {
            let client = DB.create_client();
            await client.connect();
            let database = client.db(process.env.DB_NAME);
            let db_collections = ['apiTokens', 'proxies', 'accounts', 'profiles'];
            // Authentication
            for (let i in db_collections) {
                // console.log(i);
                try {
                    await database.createCollection(db_collections[i]);
                } catch (e) {
                    conf.deb.high(e)
                } finally {
                    conf.deb.med(`Initializing collection ${db_collections[i]}`)
                }
                // conf.deb.low("< Initializing database collections complete >")
            }
            let apiTokens = await database.collection('apiTokens').find().toArray();
            conf.deb.low(apiTokens);
            if (await apiTokens.length === 0) {
                let beaconToken = DB.generateToken({amount: 1, token_access: 2, name: "Super Admin", email: "dougiefresh1513@gmail.com"})
                await database.collection('apiTokens').insertOne(beaconToken, {forceServerObjectId: true}, function (result) {
                    console.log(result);
                });
            } else {
                console.log("< Super admin already complete >")
            }

        } else {
            console.error("xx Initializing unavailable xx")
        }
    }
};

(async () => {
    if (conf.env.id === 1) {
        var action = '';
        while(action !== 'exit') {
            action = Pro.choosable_array(complete_action_list, "Which action?\n", "exit");
            if (complete_action_list.hasOwnProperty(action)) {
                console.log(`Function ${action} was chosen`)
                await complete_action_list[action]()
            }
        }
        process.exit(1);
    }
})();
