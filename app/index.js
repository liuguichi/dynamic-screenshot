const Koa = require('koa');
const bodyBody = require('koa-body');
const router = require('koa-router')();
const screenshot = require('./utils/screenshot');
const app = new Koa();
const log = console.log;

app.use(bodyBody());
router.post('/screenshot', async (ctx) => {
  log(`[request body : ${JSON.stringify(ctx.request.body)}]`);
  const params = ctx.request.body
  if (!params || !params.address || !params.path) {
    ctx.status = 200;
    ctx.body = {
      result: 0,
      msg: '[address, path]参数缺失'
    };
    return;
  }

  if (!(/^http(s?)/.test(params.address))) {
    ctx.body = {
      result: 0,
      msg: 'address参数格式错误'
    };
    return;
  }

  if (!(/^\/.+\/$/.test(params.path))) {
    ctx.body = {
      result: 0,
      msg: 'path参数格式错误'
    };
    return;
  }
  
  try {
    await screenshot(params);
    ctx.body = {
      result: 1,
      msg: '屏幕截图抓取成功'
    };
  } catch (e) {
    log(`[Exception:]${JSON.stringify(e)}`);
    ctx.body = {
      result: 0,
      msg: '系统暂时不可用，请稍后再试'
    };
  }
  
});

app.use(router.routes());

app.listen(3334, () => {
    log('[server started and listen on port 3334]');
});
