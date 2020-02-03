const slackAPI = require('slackbots');
require('dotenv').config();
var CronJob = require('cron').CronJob;

const targetChannel = 'buzzer_alfred';

const slackBot =
    new slackAPI({
        token: `${process.env.SLACK_TOKEN}`,
        name: 'ALFRED'
    })

let mongoose = require('mongoose');
mongoose.connect(`${process.env.MONGODB_URL}`, { useNewUrlParser: true }).then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(err);
    });

let checkStatusCron = new CronJob('* 2 * * * * ', function () {
    console.log('start checking');
    sendWarningToSlack();
}, null, true, 'America/Los_Angeles');
checkStatusCron.start();



function sendWarningToSlack() {
    slackBot.on('message', () => {
        if (mongoose.connection.readyState == 0) {
            slackBot.postMessageToChannel(targetChannel, 'Database disconnected');
        } else if (mongoose.connection.readyState == 2) {
            slackBot.postMessageToChannel(targetChannel, 'Database is connecting');
        } else if (mongoose.connection.readyState == 3) {
            slackBot.postMessageToChannel(targetChannel, 'Database is disconnecting');
        } else if (mongoose.connection.readyState == 1) {
            console.log('DB is connected');
        }
    })
}


