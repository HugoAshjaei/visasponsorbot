const {
    SendJobs
} = require('./Bots/Telegram/DoStuff')
const {
    GetAll
} = require('./AIO')

cron.schedule('0 */6 * * *', () => {
    GetAll().then(async (result) => {
        if (result.length != 0) {
            await SendJobs(result)
        }
        throw Error('result is empty')
    }).catch((e) => {
        console.log(e);
    });
});