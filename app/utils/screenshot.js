const phantom = require('phantom');
const fs = require('fs');
const mkdirp = require('mkdirp');
const dateUtil = require('./date');
const compress = require('./compress');
const log = console.log;

async function screenshot(params) {
    let defaultPath = `${params.path}${dateUtil.currentMonth()}/`;
    // path 为绝对路径 必须 斜杆结尾
    if (!fs.existsSync(defaultPath)) {
        mkdirp.sync(defaultPath);
    }
    defaultPath = `${defaultPath}${dateUtil.currentDay()}.jpeg`;

    log(`[图片存储在${defaultPath}]`);

    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.property('settings', {
        javascriptEnabled: true,
        loadImages: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    });
    await page.property('viewportSize', { width: 375, height: 667 });
    const status = await page.open(params.address);
    log(`[STATUS]: ${status}`);
    await page.evaluate(function() {
        window.document.body.scrollTop = window.document.body.scrollHeight;
    });
    setTimeout(async () => {
        await page.render(defaultPath, { quality: '100' });
        log(`page render successfully`);
        await instance.exit();
        if (params.compress) {
            await compress(defaultPath);
        }
    }, 5000);
}

module.exports = screenshot;