const Company = require('../models/Company');
const _ = require('lodash');

module.exports = async (job) => {
    try {
        const exist = await Company.findOne({
            name: {
                $regex: new RegExp(job.company, 'i')
            }
        });
        if (!exist) {
            await new Company({
                name: job.company,
                locations: [job.location],
                hashtags: job.hashtags.sort(),
                isUpdated: true,
                messageId: null,
            }).save();
            return true;
        }
        exist.locations.push(job.location);
        exist.locations = _.uniq(exist.locations);
        job.hashtags.forEach(item => {
            exist.hashtags.push(item);
        });
        exist.hashtags = (_.uniq(exist.hashtags)).sort();
        exist.isUpdated = true;
        await exist.save();
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}