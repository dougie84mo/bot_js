const {parentPort, workerData} = require('worker_threads');

const monitors = {};
const { env, deb, ports } = require('../config');
const { command_task_list } = require('../command');
// const { Pro } = require('.././tech_boy');
// const { BotTestApp } = require('../test');
const express = require('express');
let router = express.Router();



router.route('/api/user')
    .get(function (req, res) {
        res.send('Something is happening')
    })

router.route('/groups')
    .get(function (req, res) {
        res.send('Something is happening')
    })

module.exports = router;

