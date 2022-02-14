const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('connected to DB'))
    .catch((err) => console.log(err));

const {
    stackoverflowJobs
} = require('./Crawlers/stackoverflow');
const {
    relocateDotMeJobs
} = require('./Crawlers/relocatedotme');
const {
    vanhackJobs
} = require('./Crawlers/vanhack');
const {
    reeddotcodotukJobs
} = require('./Crawlers/reeddotcodotuk');
const {
    landingJobs
} = require('./Crawlers/landingdotjobs');
const {
    relocateMeDotEuJobs
} = require('./Crawlers/relocatemedoteu');
const {
    simplyhiredJobs
} = require('./Crawlers/simplyhired');
const {
    swissDevJobs
} = require('./Crawlers/swissdevjobsdotch');


module.exports.GetAll = async () => {
    try {
        let Result = []

        Result.push(
            ...(await stackoverflowJobs()),
            ...(await relocateDotMeJobs()),
            ...(await vanhackJobs()),
            ...(await reeddotcodotukJobs()),
            ...(await relocateMeDotEuJobs()),
            ...(await simplyhiredJobs()),
            ...(await swissDevJobs()),
            ...(await landingJobs()));

        return Result
    } catch (error) {
        console.log(error);
    }
}