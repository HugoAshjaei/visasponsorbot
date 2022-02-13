const { bot } = require('./bot')
require('dotenv').config({ path: '../../env' })
const { creator } = require('./msg');
const MAX_MSG_LENGTH = 3500;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMessage(message) {
    message += `<a href="https://t.me/visasponsor">@VisaSponsor</a>`

    await bot.telegram.sendMessage(process.env.CHANNEL_ID, message, { parse_mode: 'HTML', disable_notification: true })
}

module.exports.SendJobs = async (data) => {
    let message = ''
    for (let index = 0; index < data.length; index++) {
        message += creator(data[index], index);
        if (message.length >= MAX_MSG_LENGTH) {
            await sendMessage(message);
            message = '';
            await sleep(process.env.TIME_TO_SEND)
        }
    }

    if (message.length > 0) sendMessage(message);
}

