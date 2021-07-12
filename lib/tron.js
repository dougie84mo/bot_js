const { conf } = require('./config');
// const { Pro } = require('.././tech_boy');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
const proxyRouter = require("./routes/proxies");
const usersRouter = require("./routes/users");
const baseRouter = require("./routes/base");

let isLoggedIn = (req, res, next) => {
    let front_token = req.header('Authorization'), verified;
    if (!front_token) return res.status(401).send('Unauthorized');
    try {
        if (front_token.startsWith("Bearer ")) {
            front_token = front_token.slice(7,  front_token.length).trimLeft();
        }
        verified = jwt.verify(front_token, conf.TOKEN);
    }
    catch (e) {

    }
}


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // FOR LOGGING IN
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.get('/currentUser', function (req, res) {
    // TODO: Finish
    if (conf.TOKEN in list_of_tokens) {
        res.send({
            user_key: "user_key",
            user_info: "user_info"
        })
    } else {
        res.status(201)
            .cookie("access_token", "token", {
                expires: new Date(Date.now()+2*60*60*1000)
            }).redirect('/login')
    }
})

app.get('/login', function (req, res) {
    if (conf.TOKEN in list_of_tokens) {
        res.status(201)
            .cookie("access_token", "token", {
                expires: new Date(Date.now()+2*60*60*1000)
            }).redirect('/dash')
    }
    res.send()
})

app.get('/', function (req, res) {
    res.send(conf.TOKEN ? conf.TOKEN : false)
})
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // FOR AUTHENTICATED USER
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization", );
    next();
});
app.use('/', baseRouter);
app.use('/api_token', usersRouter);
app.use('/proxy', proxyRouter);

// TODO: .then,.catch for errors???
app.listen(process.env.HTTP_PORT, err => {
   if (err) {
       return console.error("Express Error", err);
   }
   console.log(`Listening on port ${process.env.HTTP_PORT}`);
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






