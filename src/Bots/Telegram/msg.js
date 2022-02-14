module.exports.creator = (Message, Index) => {
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
${Index + 1}. <a href="${url}"><b>${title}</b></a>
Company:  <i>${company}</i>
Location : ${location}
Source: ${source}
${options ? `Options: ${options}` : ''}
${content}
 ${hashtags.map(tag => {
        tag = tag.replace(/\s+/g, '_')
            .replace(/\./g, '')
            .replace(/\//g, '_')
            .replace(/\(/g, '')
            .replace(/\)/g, '')
            .replace(/\:/g, '')
            .replace(/\,/g, '')
            .replace(/\;/g, '')
            .replace(/\-/g, '_')
            .replace(/\#/g, 'sharp')
            .replace(/\&/g, 'and')
            .replace(/\+/g, 'plus')
        return `#${tag}`
    }).join(' ')}
 `
    return message.toString()
}