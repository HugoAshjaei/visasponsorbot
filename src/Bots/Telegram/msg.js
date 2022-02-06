module.exports.creator = (Message) => {
    const {
        title,
        company,
        location,
        content,
        url,
        hashtags,
        source,
        options
    } = Message
    const message = `
<b>${title}</b>
Company:  <i>${company}</i>
Location : ${location}
${options ? `Options: ${options}` : ''}

${content}
<a href="${url}">Read more and apply at ${source}</a>

 ${hashtags.map(tag => {
     tag = tag.replace(/\s+/g, '_').replace(/\./g, '').replace(/\//g, '_').replace(/\(/g, '').replace(/\)/g, '').replace(/\:/g, '').replace(/\,/g, '').replace(/\;/g, '').replace(/\-/g, '_').replace(/\#/g, 'sharp').replace(/\&/g, 'and').replace(/\+/g, 'plus')
     return `#${tag}`
    }).join(' ')}

 <a href="https://t.me/visasponsor">@VisaSponsor</a>
 `
    return message.toString()
}