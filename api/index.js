const getScreenshot = require('./screenshot');
const node_url = require('url');
const stringIsAValidUrl = (s) => {
    try {
      new URL(s);
      return true;
    } catch (err) {
      return false;
    }
  };

module.exports = async function  (req, res) {
    const {  pathname = '/' , query = {} } = node_url.parse(req.url, true);
    let url = pathname.slice(1);
    if (!url.startsWith('http')) {
        url = 'https://' + url; // add protocol if missing
    }

    res.status(200)
    if (!stringIsAValidUrl(url)) {
        res.end(`${url} is not vaild.`)
    } else {
        const type = query.type === 'png' ? 'png' : 'jpeg'; // png or jpeg
        const file = await getScreenshot(url, type);
        
        res.setHeader('Content-Type', `image/${type}`);
        res.end(file);
    }
};