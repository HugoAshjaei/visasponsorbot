const Last = require('../models/Last');
const axios = require('axios');
const updateCompany = require('../utils/updateCompany');


const landingJobs = async () => {
    try {
        let result = (await axios.get('https://landing.jobs/jobs/search.json?page=1&lr=0&match=all&vs=true&hd=false&t_co=false&t_st=false')).data;
        const jobs = Promise.all(result.offers.map(async (item) => {
            const exist = await Last.findOne({
                where: "landing.jobs",
                guid: item.id
            });
            if (!exist) {
                await new Last({
                    where: "landing.jobs",
                    guid: item.id,
                }).save();
                const title = item.title;
                const company = item.company_name || 'N/A';
                const location = item.location || 'N/A';
                let options = '';
                if (item.salary) {
                    options += `${item.salary}`.replace(' - ', ' up to ');
                }
                if (item.remote) {
                    if (options === '') {
                        options += 'Remote';
                    } else {
                        options += ' - Remote ';
                    }
                }
                if (item.contract_type) {
                    if (options === '') {
                        options += item.contract_type;
                    } else {
                        options += ' - ' + item.contract_type;
                    }
                }
                let content = '';
                const url = item.url;
                const hashtags = item.skills.map(item => item.name);
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
                    source: 'landing.jobs',
                };
            }
        }));

        return (await jobs).filter(item => item);
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    landingJobs
}