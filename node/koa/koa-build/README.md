#### 搭建koa项目
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
#### 配置koa和babel环境
```
npm install babel-core --save-dev
npm install babel-polyfill --save-dev
npm install babel-preset-es2015 --save-dev
npm install babel-preset-stage-3 --save-dev

// 在入口文件server.js中添加：
require('babel-core/register')({
    presets: ['es2015', 'stage-3']
});
  

// 在package.json的scripts中添加：
"dev": "nodemon -w server --exec \"babel-node server/server.js --presets env\"",

```



#### 使用koa-logger来记录日志
```
const logger = require('koa-logger');
app.use(logger());
```