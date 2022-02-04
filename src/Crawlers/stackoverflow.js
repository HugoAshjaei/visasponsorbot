const Last = require('../models/Last');
const moment = require('moment');
const he = require('he');
let Parser = require('rss-parser');
let parser = new Parser();


const stackoverflowJobs = async () => {
    try {
        let feed = await parser.parseURL('http://stackoverflow.com/jobs/feed?v=true');
        const jobs = Promise.all(feed.items.map(async (item) => {
            const exist = await Last.findOne({
                where: "stackoverflow",
                guid: item.guid
            });
            if (!exist) {
                await new Last({
                    where: "stackoverflow",
                    guid: item.guid,
                }).save();
                let data = item.title.replace(' (m/f/x) ', ' ').replace(' (f/m/d) ', ' ').replace(' (m/f/d) ', ' ').replace(/-/g, ' ').replace(/\//g, ' ').replace(/\s+/g, ' ').replace('(m f x)', '').trim();
                const title = data.split(' at ')[0].replace(/\(/g, '').trim().replace(/\)/g, '');
                const company = data.split(' at ')[1].split(' (')[0].trim();
                const location = data.replace(') (', ' - ').split(' (')[data.replace(') (', ' - ').split(' (').length - 1].replace(')', '').trim();
                let content = item.content.replace(/<[^>]+>/g, '').split('. ').slice(0, 3).join('. ') + '...';
                if (content.length > 500) {
                    content = item.content.replace(/<[^>]+>/g, '').split('. ').slice(0, 2).join('. ') + '...';
                    if (content.length > 500) {
                        content = item.content.replace(/<[^>]+>/g, '').split('. ').slice(0, 1).join('. ') + '...';
                    }
                }
                content = he.decode(content);
                const url = item.link;
                const hashtags = [...item.categories];

                return {
                    title,
                    company,
                    location,
                    content,
                    url,
                    hashtags,
                    source: 'stackoverflow',
                };
            }
        }));
        console.log(await jobs);
        return [... await jobs];
    } catch (err) {
        console.log(err)
    }
}


module.exports = {
    stackoverflowJobs
}