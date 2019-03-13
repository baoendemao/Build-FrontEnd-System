### koa router
#### 基础

* 方法1：koa-router => 推荐
    * 例子（1）：

        ```

        // 根据不同的请求，分别处理显示不同的内容
        const Koa = require('koa');
        const app = new Koa();
        const Router = require('koa-router');
        const router = new Router();

        // 每一条请求都会打印出请求的方法和请求的Url => ctx.request得到请求的method和url
        app.use(async (ctx, next) => {
            console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
            await next();
        });

        router.get('/hello/:name', async (ctx, next) => {
            let name = ctx.params.name;
            ctx.body = `<h1>Hello, ${name}!</h1>`;
        });

        router.get('/', async (ctx, next) => {
            ctx.body = '<h1>Home page</h1>';
        });

        app.use(router.routes());

        app.listen(3000)
        console.log('server is starting at port 3000')

        ```
    * 例子（2）：从mongo数据库中读取数据，每次访问路由，由相应的controller做处理：

        ```
        const mongoose = require('mongoose');
        const Router = require('koa-router');
        const router = new Router();

        // 获取所有的文章
        // http://localhost:8888/articles
        router.get('/articles', async (ctx, next) => {
          const Article = mongoose.model('Article');

          const articles = await Article.find({}).sort({
            'meta.createdAt': -1
          });

          ctx.body = {
            articles
          }
        });

        // 根据id获取某一篇文章
        // http://localhost:8888/articles/1111
        router.get('/articles/:id', async (ctx, next) => {
          const Article = mongoose.model('Article');

          const id = ctx.params.id;
          const article = await Article.findOne({_id: id});

          ctx.body = {
            article
          }
        });

        module.exports = router;

        ```
* 方法2：使用app.use()处理不同的路由 => 推荐使用方法1

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

#### 使用Decorator来装饰Koa的路由
* 概念
    * Decorator只能作用于类或类的方法上
    * 如果一个类和类的方法都是用了Decorator，类方法的Decorator优先于类的Decorator执行
