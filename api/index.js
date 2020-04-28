const getScreenshot = require('./screenshot');
const node_url = require('url');
const readme = 'https://github.com/NeverBehave/now-puppeteer'

module.exports = async function  (req, res) {
    const { pathname = '/', query = {} } = node_url.parse(req.url, true);
    if (pathname.length <= 1) {
        res.status(302)
        res.setHeader('Location', readme)
    }
    const { type = 'png' } = query; // png or jpeg
    let url = pathname.slice(1);
    if (!url.startsWith('http')) {
        url = 'https://' + url; // add protocol if missing
    }
    const file = await getScreenshot(url, type);
    res.status(200);
    res.setHeader('Content-Type', `image/${type}`);
    res.end(file);
};