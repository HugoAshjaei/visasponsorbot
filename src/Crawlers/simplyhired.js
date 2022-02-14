const Last = require('../models/Last');
const axios = require('axios');
const cheerio = require('cheerio');
const _ = require('lodash');
const he = require('he');
let Parser = require('rss-parser');
let parser = new Parser();
const updateCompany = require('../utils/updateCompany');


const simplyhiredJobs = async () => {
    try {
        let html = await axios.get('https://www.simplyhired.com/search?q=information+technology+visa+sponsorship');
        const $ = cheerio.load(html.data);
        const jobs = await Promise.all($('.SerpJob').map(async (i, el) => {
            const title = $(el).find('.SerpJob-link.card-link').text().trim();
            const company = $(el).find('.JobPosting-labelWithIcon.jobposting-company').text().trim();
            const content = $(el).find('.jobposting-snippet').text().trim();
            const location = $(el).find('.jobposting-location').first().text().trim();
            let url = $(el).find('.SerpJob-link.card-link').attr('href');
            if (!url.startsWith('https://www.simplyhired.com')) {
                url = 'https://www.simplyhired.com' + url;
            }
            let options = '';
            if ($(el).find('.jobposting-salary').text().trim()) {
                options = $(el).find('.jobposting-salary').text().trim().replace(' - ', ' up to ').replace('Estimated:', '').replace(' a ', ' per ').replace(' an ', ' per ').trim();
            }

            const hashtags = title.toLowerCase()
                .replace('full stack', 'fullstack')
                .replace('big data', 'big-data')
                .replace('software', '')
                .replace('engineer', '')
                .replace('developer', '')
                .replace('.net', 'dotnet')
                .replace(/[^\w\s]/gi, '')
                .replace(' and ', ' ')
                .replace(' or ', ' ')
                .replace(' with ', ' ')
                .replace('for', ' ')
                .replace('iii', ' ')
                .replace('usa', ' ')
                .replace('success', ' ')
                .replace('-', '')
                .replace('/', '')
                .split(' ')
                .filter(item => item.length > 2).map(item => item.replace(/[^\w\s]/gi, ''));
            const exist = await Last.findOne({
                where: "simplyhired",
                guid: url
            });
            if (!exist) {
                await new Last({
                    where: "simplyhired",
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
                    options,
                    source: 'Simplyhired',
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

simplyhiredJobs().then(res => {
    console.log(res);
})

module.exports = {
    simplyhiredJobs
}