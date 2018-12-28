const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const fs = require('fs');
const mkdirp = require('mkdirp');
const dateUtil = require('./date');
const compress = require('./compress');
const log = console.log;
const iPhone6 = devices['iPhone 5'];

const isProd = process.env.NODE_ENV === 'prod';
async function screenshot(params) {
    let defaultPath = `${params.path}${dateUtil.currentMonth()}/`;
    // path 为绝对路径 必须 斜杆结尾
    if (!fs.existsSync(defaultPath)) {
        mkdirp.sync(defaultPath);
    }
    defaultPath = `${defaultPath}${dateUtil.currentDay()}.jpeg`;

    log(`[图片存储在${defaultPath}]`);

    let browser = null;
    if (isProd) {
        log(`[ENV:] ${process.env.NODE_ENV}`);
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        log(`[Prod browser inited successfully]`);
    } else {
        browser = await puppeteer.launch({
            headless: false,
            executablePath: '/Users/liuguichi/dw_project/node-server/dynamic-image-service/chrome-mac/Chromium.app/Contents/MacOS/Chromium',
        });
    }
    const page = await browser.newPage();
    log(`[page inited successfully]`);
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
    log(`[page setUserAgent successfully]`);
    await page.emulate(iPhone6);
    log(`[page emulate iPhone6 successfully]`);
    await page.goto(params.address, {
        waitUntil: ['networkidle0'],
        timeout: 12000,
    });
    log(`[page goto ${params.address} successfully]`);
    await page.waitFor(2000);
    log(`[page waitFor successfully]`);
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
    log(`[screenshot start]`);
    await page.screenshot({ 
        path: defaultPath,
        quality: 100,
        fullPage: true,
        });
    log(`[screenshot end]`);
    await browser.close();
    if (params.compress) {
        await compress(defaultPath);
    }
}

module.exports = screenshot;