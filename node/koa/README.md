#### koa
##### 新建koa工程
* 初始化项目
```
// 初始化package.json
npm init 

// 安装koa2
npm install koa --save

// 安装node热更新
npm install -g nodemon

```

* 新建server.js， 使用app.use()处理请求
```
// server.js
const Koa = require('koa')
const app = new Koa()

app.use( async ( ctx, next ) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<p>Hello, world</p>';
})

app.listen(3000)
console.log('server is starting at port 3000')

// 运行
nodemon server.js
```
#### 处理不同的路由
* 使用app.use()处理不同的路由
```
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
    if (ctx.request.path === '/react') {
        ctx.response.body = 'react page';
    } else {
        await next();
    }
});

app.use(async (ctx, next) => {
    if (ctx.request.path === '/vue') {
        ctx.response.body = 'vue page';
    } else {
        await next();
    }
});

app.use( async ( ctx, next ) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<p>Hello world</p>';
})

app.listen(3000)
console.log('server is starting at port 3000')
```
浏览器中分别访问/ , /vue, /react, 得到不同的结果。

* koa-router => 推荐
```
// 根据不同的请求，分别处理显示不同的内容
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();

// 每一条请求都会打印出请求的方法和请求的Url
app.use(async(ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

router.get('/hello/:name', async(ctx, next) => {
    let name = ctx.params.name;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
});

router.get('/', async(ctx, next) => {
    ctx.response.body = '<h1>Home page</h1>';
});

app.use(router.routes());

app.listen(3000)
console.log('server is starting at port 3000')
```
#### 处理post请求
```
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
```
#### 使用koa-logger来记录日志
```
const logger = require('koa-logger');
app.use(logger());
```