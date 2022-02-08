const Last = require('../models/Last');
const moment = require('moment');
const he = require('he');
const axios = require('axios');
const updateCompany = require('../utils/updateCompany');


const vanhackJobs = async () => {
    try {
        let result = (await axios.get('https://vanhack.com/access/v2/job?SkipCount=0&ShowVhJobs=false&query=visa%20sponsorship&&&recommended=false')).data;
        const jobs = Promise.all(result.result.items.map(async (item) => {
            const exist = await Last.findOne({
                where: "vanhack",
                guid: item.id
            });
            if (!exist) {
                await new Last({
                    where: "vanhack",
                    guid: item.id,
                }).save();
                if (item.title) {
                    const title = item.title;
                    const company = '----';
                    const location = item.location;
                    let options = '';
                    if (item.salaryFrom) {
                        options += `${item.salaryFrom}000 ${item.currency}/Annual`;
                    }
                    if (item.salaryTo) {
                        options += ` up to ${item.salaryTo}000 ${item.currency}/Annual`;
                    }
                    if (item.relocateName) {
                        if (options == '') {
                            options += `${item.relocateName}`;
                        } else {
                            options += ` - ${item.relocateName}`;
                        }
                    }
                    let content = item.description.replace(/<[^>]+>/g, '').split('. ').slice(0, 3).join('. ') + '...';
                    if (content.length > 500) {
                        content = item.description.replace(/<[^>]+>/g, '').split('. ').slice(0, 2).join('. ') + '...';
                        if (content.length > 500) {
                            content = item.description.replace(/<[^>]+>/g, '').split('. ').slice(0, 1).join('. ').slice(0, 500) + '...';
                        }
                    }
                    content = he.decode(content);
                    const url = 'https://vanhack.com/job/' + item.id;
                    const hashtags = item.skills.map(item => item.name);
                    updateCompany({ title, company, location, content, url, hashtags });
                    return {
                        title,
                        company,
                        location,
                        content,
                        url,
                        hashtags,
                        options,
                        source: 'vanhack',
                    };
                }
            }
        }));

        return (await jobs).filter(item => item);
    } catch (err) {
        console.log(err)
    }
}


module.exports = {
    vanhackJobs
}