const slackAPI = require('slackbots');
require('dotenv').config();
let schedule = require('node-schedule');


const targetChannel = 'buzzer_alfred';

const params = {
    icon_emoji: ':stethoscope_production:'
}

const slackBot =
    new slackAPI({
        token: `${process.env.SLACK_TOKEN}`,
        name: 'ALFRED_Database_Stethoscope (production)'
    })

let mongoose = require('mongoose');
mongoose.connect(`${process.env.MONGODB_URL}`, { useNewUrlParser: true }).then(() => console.log('DB Connected!'))
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
        slackBot.postMessageToChannel(targetChannel, '【Database 1.0】 disconnected at ' + time, params);
    } else if (mongoose.connection.readyState == 2) {
        slackBot.postMessageToChannel(targetChannel, '【Database 1.0】 is connecting at ' + time, params);
    } else if (mongoose.connection.readyState == 3) {
        slackBot.postMessageToChannel(targetChannel, '【Database 1.0】 is disconnecting at ' + time, params);
    } else if (mongoose.connection.readyState == 1) {
        console.log('Database is connected at ' + time);
    }
}




