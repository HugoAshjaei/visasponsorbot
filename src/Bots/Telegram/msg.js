module.exports.creator = (Message) => {
    const {
        title,
        company,
        location,
        content,
        url,
        hashtags,
        source
    } = Message
    const message = `
<b>${title}</b>
company:  <i>${company}</i>
location : ${location}

${content}
<a href="${url}"> Read more and apply at ${source}</a>

 ${hashtags.map(tag => {
     tag = tag.replace(/\s+/g, '_').replace(/\./g, '').replace(/\//g, '_').replace(/\(/g, '').replace(/\)/g, '').replace(/\:/g, '').replace(/\,/g, '').replace(/\;/g, '').replace(/\-/g, '_');
     return `#${tag}`
    }).join(' ')}
 <a href="https://t.me/visasponsor">@VisaSponsor</a>
 `
    return message.toString()
}