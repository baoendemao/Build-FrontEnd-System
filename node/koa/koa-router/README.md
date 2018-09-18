#### 处理不同的路由
* 方法1：使用app.use()处理不同的路由

```
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
    if (ctx.request.path === '/react') {
        ctx.body = 'react page';
    } else {
        await next();
    }
});

app.use(async (ctx, next) => {
    if (ctx.request.path === '/vue') {
        ctx.body = 'vue page';
    } else {
        await next();
    }
});

app.use( async ( ctx, next ) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.body = '<p>Hello world</p>';
})

app.listen(3000)
console.log('server is starting at port 3000')

```

浏览器中分别访问/ , /vue, /react, 得到不同的结果。

* 方法2：koa-router => 推荐
```
// 根据不同的请求，分别处理显示不同的内容
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();

// 每一条请求都会打印出请求的方法和请求的Url => ctx.request得到请求的method和url
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

router.get('/hello/:name', async(ctx, next) => {
    let name = ctx.params.name;
    ctx.body = `<h1>Hello, ${name}!</h1>`;
});

router.get('/', async(ctx, next) => {
    ctx.body = '<h1>Home page</h1>';
});

app.use(router.routes());

app.listen(3000)
console.log('server is starting at port 3000')

```