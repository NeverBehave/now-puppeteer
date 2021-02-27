const getScreenshot = require('./screenshot');
const node_url = require('url');
const pTime = require('p-time');
const stringIsAValidUrl = (s) => {
    try {
      new URL(s);
      return true;
    } catch (err) {
      return false;
    }
  };
const downloadFont = async () => {
  await chrome.font('https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@master/fonts/NotoColorEmoji.ttf');
  await chrome.font('https://cdn.jsdelivr.net/gh/googlefonts/noto-cjk@master/NotoSansCJK-Regular.ttc');
}
const timedDownload = pTime(downloadFont)

module.exports = async function  (req, res) {
  await timedDownload;
  const timeDiff = Math.round(((timedDownload.time) /= 1000) % 60);
  if (timeDiff > 3) {
    // Well, we have downloaded the font, and we don't have much time left.
    // However, now I am ready. See you on next request! 
    res.writeHead(302, {
      'Location': req.url
    })
    res.end();
    return
  }
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