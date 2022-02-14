const Last = require('../models/Last');
const axios = require('axios');
const updateCompany = require('../utils/updateCompany');


const swissDevJobs = async () => {
    try {
        let result = (await axios.get('https://swissdevjobs.ch/api/jobsLight')).data;
        const jobs = Promise.all(result.map(async (item) => {
            if (item.hasVisaSponsorship.toLowerCase() != 'yes') {
                return null;
            }
            const exist = await Last.findOne({
                where: "swissdevjobs",
                guid: item._id
            });
            if (!exist) {
                await new Last({
                    where: "swissdevjobs",
                    guid: item._id,
                }).save();
                const title = item.name.trim();
                const company = item.company.trim() || 'N/A';
                const location = item.actualCity + ' - Switzerland' || 'Switzerland';
                let options = '';
                if (item.annualSalaryFrom) {
                    options += `${item.annualSalaryFrom} CHF`;
                }
                if (item.annualSalaryTo) {
                    if (options === '') {
                        options += `${item.annualSalaryTo} CHF`;
                    } else {
                        options += ` up to ${item.annualSalaryTo} CHF`;
                    }
                }
                if (item.annualSalaryFrom || item.annualSalaryTo) {
                    options += ' per annual';
                }
                if (item.perkKeys) {
                    item.perkKeys.forEach(item => {
                        if (options === '') {
                            options += item;
                        } else {
                            options += ` - ${item}`;
                        }
                    });
                }

                let content = '';
                const url = item.jobUrl.startsWith('https://swissdevjobs.ch/jobs/') ? item.jobUrl : `https://swissdevjobs.ch/jobs/${item.jobUrl}`;
                const hashtags = [];
                if (item.technologies) {
                    item.technologies.forEach(item => {
                        hashtags.push(item.toLowerCase());
                    });
                }
                if (item.filterTags) {
                    item.filterTags.forEach(item => {
                        if (hashtags.indexOf(item.toLowerCase()) === -1 && item.length > 2) {
                            hashtags.push(item.toLowerCase());
                        }
                    });
                }
                updateCompany({
                    title,
                    company,
                    location,
                    content,
                    url,
                    hashtags
                });
                return {
                    title,
                    company,
                    location,
                    content,
                    url,
                    hashtags,
                    options,
                    source: 'Swiss dev jobs',
                };
            }
        }));

        return (await jobs).filter(item => item);
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    swissDevJobs
}