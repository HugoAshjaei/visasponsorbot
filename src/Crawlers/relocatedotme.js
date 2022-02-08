const Last = require('../models/Last');
const axios = require('axios');
const cheerio = require('cheerio');
const _ = require('lodash');
const he = require('he');
let Parser = require('rss-parser');
let parser = new Parser();
const updateCompany = require('../utils/updateCompany');


const relocateDotMeJobs = async () => {
    try {
        let html = await axios.get('https://relocate.me/search');
        const $ = cheerio.load(html.data);
        const jobs = await Promise.all($('.jobs-list__job').map(async (i, el) => {
            const title = $(el).find('.job__title a b').text().trim();
            const company = $(el).find('.job__company').text().trim();
            const content = $(el).find('.job__preview').text().trim();
            let location = $(el).find('.job__title a').text().trim().split('\n')[1].trim();
            if (location.startsWith('in ')) {
                location = location.substring(3);
            }
            let url = $(el).find('.job__title a').attr('href');
            if (!url.startsWith('https://relocate.me')) {
                url = 'https://relocate.me' + url;
            }
            const hashtags = [...$(el).find('.job__tag').map((i, el) => $(el).text().trim()).get()];
            const exist = await Last.findOne({
                where: "relocate.me",
                guid: url
            });
            if (!exist) {
                await new Last({
                    where: "relocate.me",
                    guid: url,
                }).save();
                updateCompany({ title, company, location, content, url, hashtags });
                return {
                    title,
                    company,
                    location,
                    content,
                    url,
                    hashtags,
                    source: 'Relocate .me',
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
    relocateDotMeJobs
}