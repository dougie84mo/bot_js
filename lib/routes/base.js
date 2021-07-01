const {Discorder, Pro, Thor, deb, sleep} = require('../bot_thread');
const axios = require('axios');
const path = require('path');
const {parentPort, workerData} = require('worker_threads');

const monitors = {};
// const { Pro } = require('.././tech_boy');
// const { BotTestApp } = require('../test');
const express = require('express');
let router = express.Router();



router.route('/group/:group_id')
    .get(function (req, res) {
        res.send('Something is happening')
    })

router.route('/groups')
    .get(function (req, res) {
        res.send('Something is happening')
    })

module.exports = router;

