const Last = require('../models/Last');
const axios = require('axios');
const cheerio = require('cheerio');
const _ = require('lodash');
const he = require('he');
let Parser = require('rss-parser');
let parser = new Parser();
const updateCompany = require('../utils/updateCompany');


const reeddotcodotukJobs = async () => {
    try {
        let html = await axios.get('https://www.reed.co.uk/jobs/visa-sponsorship-jobs?parentsector=it-telecoms');
        const $ = cheerio.load(html.data);
        const jobs = await Promise.all($('.job-result-card').map(async (i, el) => {
            const title = $(el).find('.job-result-heading__title').text().trim();
            const company = $(el).find('.gtmJobListingPostedBy').text().trim();
            const content = $(el).find('.job-result-description__details').text().trim();
            let location;
            if ($(el).find('.job-metadata__item.job-metadata__item--location').text().trim().split('\n')[0].split(',').length > 1) {
                location = $(el).find('.job-metadata__item.job-metadata__item--location').text().trim().split('\n')[0];
            } else {
                location = $(el).find('.job-metadata__item.job-metadata__item--location').text().trim().split('\n')[0] + ', UK';
            }
            let url = $(el).find('.gtmJobTitleClickResponsive').attr('href');
            if (!url.startsWith('https://www.reed.co.uk')) {
                url = 'https://www.reed.co.uk' + url;
            }
            let options = '';
            if ($(el).find('.job-metadata__item.job-metadata__item--salary').text().trim()) {
                options = $(el).find('.job-metadata__item.job-metadata__item--salary').text().trim().replace(' - ', ' up to ').trim();
            }
            if ($(el).find('.job-metadata__item.job-metadata__item--type').text().trim()) {
                if (options === '') {
                    options = $(el).find('.job-metadata__item.job-metadata__item--type').text().trim().replace(', ', ' - ').trim();
                } else {
                    options = options + ' - ' + $(el).find('.job-metadata__item.job-metadata__item--type').text().trim().replace(', ', ' - ').trim();
                }
            }
            const hashtags = title.toLowerCase()
                .replace('full stack', 'fullstack')
                .replace('big data', 'big-data')
                .replace('software','')
                .replace('engineer','')
                .replace('developer','')
                .replace('.net', 'dotnet')
                .replace(/[^\w\s]/gi, '')
                .replace(' and ', ' ')
                .replace(' or ', ' ')
                .replace(' with ', ' ')
                .replace('success', ' ')
                .replace('-', '')
                .replace('/', '')
                .split(' ')
                .filter(item => item.length > 2).map(item => item.replace(/[^\w\s]/gi, ''));
            const exist = await Last.findOne({
                where: "reed.co.uk",
                guid: url
            });
            if (!exist) {
                await new Last({
                    where: "reed.co.uk",
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
                    options,
                    source: 'reed',
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

reeddotcodotukJobs().then(res => {
    console.log(res);
});

module.exports = {
    reeddotcodotukJobs
}