const Last = require('../models/Last');
const axios = require('axios');
const cheerio = require('cheerio');
const _ = require('lodash');
const he = require('he');
let Parser = require('rss-parser');
let parser = new Parser();
const updateCompany = require('../utils/updateCompany');


const relocateMeDotEuJobs = async () => {
    try {
        let html = await axios.get('https://relocateme.eu/jobs/');
        const $ = cheerio.load(html.data);
        const jobs = await Promise.all($('.job').map(async (i, el) => {
            const title = $(el).find('.job_title a').text().trim();
            const company = $(el).find('.company-name').text().trim();
            const content = $(el).find('.job_description').text().trim();
            const location = $(el).find('.country-name').text().trim();
            const url = $(el).find('.job_title a').attr('href');
            const hashtags = [...$(el).find('.job_tags.list-inline li').map((i, el) => $(el).text().trim()).get()];
            const exist = await Last.findOne({
                where: "relocateme.eu",
                guid: url
            });
            if (!exist) {
                await new Last({
                    where: "relocateme.eu",
                    guid: url,
                }).save();
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
                    source: 'Relocateme.eu',
                };
            } else {
                return null;
            }
        }));

        return (await jobs).filter(item => item);
    } catch (err) {
        console.log(err)
    }
}


module.exports = {
    relocateMeDotEuJobs
}