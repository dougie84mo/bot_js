const {uniqueNamesGenerator} = require('unique-names-generator');
const { Pro, Thor} = require('./bot_thread');
const readline = require('readline-sync');
const random_name = require('node-random-name');


const profiles = Pro.profiles_config();
const raffle_config = Pro.raffle_configuration('raffle');


console.log(profiles, raffle_config);


const processes_to_run = readline.questionInt("How many raffle times do you want to run the raffle? ");

//     let pid = products_ids[product_id];
//     if (bot.hasOwnProperty("product_id_type")) {
//
//         setTimeout(function() {
//             let product_identification = typeof pid === "object" ? pid.id : pid;
//             console.log(`The ${bot_key} # ${prod_num} monitor will run product id ${product_identification}`);
//             let workData = {config, bot, pid, delay, prod_num, timestamp, lc_bot};
//             // // console.log(config, bot, pid, prod_num, timestamp);
//             const port = new Worker(require.resolve(bot_file), {
//                 workerData: workData,
//             });
//             // // port.on("message", (data) => console.log(`Worker data running for bot ${lc_bot} product sku:${data['product_id']} `));
//             // port.on("error", (e) => console.log(e));
//             // // port.on("exit", (code) => console.log(`Exit code ${code} from bot ${lc_bot}`));
//             prod_num++;
//         }, 3000 * ex_prod_num);
//         ex_prod_num++;
//     } else {
//         console.info(`The ${i} monitor is not configured`);
//     }
// }
