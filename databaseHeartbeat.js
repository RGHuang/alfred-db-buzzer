const slackAPI = require('slackbots');
require('dotenv').config();
let schedule = require('node-schedule');


const targetChannel = 'buzzer_alfred';

const slackBot =
    new slackAPI({
        token: `${process.env.SLACK_TOKEN}`,
        name: 'ALFRED_Database_Heartbeat'
    })

let mongoose = require('mongoose');
mongoose.connect(`${process.env.BOT_MONGODB_URL}`, { useNewUrlParser: true }).then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(err);
    });

process.env.TZ = 'Asia/Shanghai'

let checkStatusSchedule = new schedule.scheduleJob('10 * * * * * ', function () {
    console.log('start checking');
    let checkingTime = new Date();
    sendWarningToSlack(checkingTime);
});



function sendWarningToSlack(time) {
    if (mongoose.connection.readyState == 0) {
        slackBot.postMessageToChannel(targetChannel, 'Database disconnected at ' + time);
    } else if (mongoose.connection.readyState == 2) {
        slackBot.postMessageToChannel(targetChannel, 'Database is connecting at ' + time);
    } else if (mongoose.connection.readyState == 3) {
        slackBot.postMessageToChannel(targetChannel, 'Database is disconnecting at ' + time);
    } else if (mongoose.connection.readyState == 1) {
        console.log('DB is connected at ' + time);
    }
}


