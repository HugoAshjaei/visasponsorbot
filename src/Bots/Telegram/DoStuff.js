const { bot } = require('./bot')
require('dotenv').config({ path: '../../env' })
const { creator } = require('./msg')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.SendJobs = async (data) => {
    for (let index = 0; index < data.length; index++) {
        await bot.telegram.sendMessage(process.env.CHANNEL_ID, creator(data[index]), { parse_mode: 'HTML', disable_notification: true })
        await sleep(parseInt(process.env.TIME_TO_SEND))
    }
}

