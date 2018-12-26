const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const fs = require('fs');
const dateUtil = require('./date');
const compress = require('./compress');
const log = console.log;
const iPhone6 = devices['iPhone 5'];

const isProd = process.env.NODE_ENV === 'prod';
async function screenshot(params) {
    if (!params || !params.address) {
        log('[必须包含所需截屏网页的地址]');
        return;
    }
    let defaultPath = `/usr/local/var/www/images/${dateUtil.currentMonth()}/${dateUtil.currentDay()}.jpeg`;
    // path 为绝对路径 必须 斜杆结尾
    if (fs.existsSync(params.path)) {
        defaultPath = `${params.path}${dateUtil.currentMonth()}/${dateUtil.currentDay()}.jpeg`;
    }

    log(`[图片存储在${defaultPath}]`);

    let browser = null;
    if (isProd) {
        log(`[ENV:] ${process.env.NODE_ENV}`);
        browser = await puppeteer.launch();
        log(`[Prod browser inited successfully]`);
    } else {
        browser = await puppeteer.launch({
            executablePath: '/Users/liuguichi/dw_project/node-server/dynamic-image-service/chrome-mac/Chromium.app/Contents/MacOS/Chromium',
        });
    }
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
    await page.emulate(iPhone6);
    await page.goto(params.address, {
        waitUntil: ['networkidle0'],
        timeout: 12000,
    });
    await page.waitFor(2000);
    return new Promise((resolve) => {
        setTimeout(async () => {
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
            resolve();
          }, 1000);
    });
    
}

module.exports = screenshot;