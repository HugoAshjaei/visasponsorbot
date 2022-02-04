const ProxyAgent = require('https-proxy-agent')
if (process.env.PROXY_SERVER) {
    const Agent = new ProxyAgent(process.env.PROXY_SERVER)
    module.exports = { Agent }
}
