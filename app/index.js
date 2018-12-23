const Koa = require('koa');
const bodyBody = require('koa-body');
const screenshot = require('./utils/screenshot');
const schedule = require('node-schedule');
const dateUtil = require('./utils/date');
const app = new Koa();
const log = console.log;

app.use(bodyBody());

// response
app.use(async ctx => {
  log(`[request info: ${JSON.stringify(ctx.request)}]`);
  if (!dateUtil.isTradingDay()) {
    ctx.body = '今天不是交易日';
    return;
  }
  if (ctx.request.path === '/screenshot' && ctx.method.toLowerCase() === 'post') {
    log(`[request body : ${JSON.stringify(ctx.request.body)}]`);
    await screenshot(ctx.request.body)
      .then(() => {
        ctx.body = '屏幕截图抓取成功';
      })
      .catch((e) => {
        ctx.body = '系统暂时不可用，请稍后再试';
      })
  } else if (ctx.request.path === '/job' && ctx.method.toLowerCase() === 'post') {
    startJob(ctx.request.body);
    ctx.body = 'job 开启成功';
  } else {
    ctx.status = 400;
    ctx.body = '不支持该请求';
  }
});

// 每天15:30 定时执行
async function startJob(params) {
    const job = schedule.scheduleJob('0 30 15 * * *', async function(){
        log('[job 0 30 15 * * * inited]');
        if (dateUtil.isTradingDay()) {
          log('is trading day start generate image, please wait....');
          await screenshot(params);
        }
      });
}

app.listen(3333, () => {
    log('[server started and listen on port 3333]');
});
