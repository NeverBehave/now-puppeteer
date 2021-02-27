const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function downloadFont() {
    await chrome.font('https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@master/fonts/NotoColorEmoji.ttf');
    await chrome.font('https://cdn.jsdelivr.net/gh/googlefonts/noto-cjk@master/NotoSansCJK-Regular.ttc');
}

async function getScreenshot(url, type) {
    const browser = await puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
    });

    const page = await browser.newPage();
    await page.goto(url);
    const file = await page.screenshot({ type });
    await browser.close();
    return file;
}

module.exports = {
    getScreenshot,
    downloadFont
};