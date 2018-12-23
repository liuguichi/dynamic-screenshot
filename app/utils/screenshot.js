const puppeteer = require('puppeteer');
const fs = require('fs');
const dateUtil = require('./date');
const compress = require('./compress');
const log = console.log;

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

    const browser = await puppeteer.launch({
        executablePath: '/Users/liuguichi/dw_project/node-server/dynamic-image-service/chrome-mac/Chromium.app/Contents/MacOS/Chromium',
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
    await page.setViewport({
        width: 375,
        height: 1000,
        isMobile: true,
    })
    await page.goto(params.address, {
        waitUntil: ['networkidle0'],
        timeout: 12000,
    });
    return new Promise((resolve) => {
        setTimeout(async () => {
            await page.screenshot({ 
                path: defaultPath,
                quality: 100,
                fullPage: true,
              });
          
            await browser.close();
            if (params.compress) {
              await compress(defaultPath);
            }
            resolve();
          }, 1000);
    });
    
}

module.exports = screenshot;