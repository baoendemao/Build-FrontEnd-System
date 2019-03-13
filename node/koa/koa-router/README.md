### koa router

#### 例子
* 例子（1）koa-router处理路由

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
* 例子（3）使用ctx.request.path处理不同的路由 

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

* 例子（4）404页面
```
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
    const { url, method } = ctx
    if (url === '/404' && method === 'GET') {
        ctx.body = '404, page not found'
        ctx.status = 404
    } else {
        ctx.body = 'hello world'
    }
    await next()
})

app.listen(8080)

```
* 例子（5）定义通用的路由组件
```
class Router {
    constructor() {
        // 缓存的路由规则
        this._routes = []
    }
    
    get(url, handler) {
        this._routes.push({
            url: url,
            method: 'GET',
            handler
        })
    }

    routes() {
        return async (ctx, next) => {
            const { method, url } = ctx
            const matchedRouter = this._routes.find(r => r.method === method && r.url === url)

            // 执行路由规则中的handler，响应请求
            if (matchedRouter &&
                matchedRouter.handler) {
                await matchedRouter.handler(context, next)
            } else {
                await next()
            }
        }
    }
}

调用：

router.get('/404', (ctx, next) => {
    ctx.body = '404, page not found'
    ctx.status = 404
})

app.use(router.routes())




```
* 例子（6）

```
    const Koa = require('koa')
    const Route = require('koa-router')
    const app = new Koa()

    const router = new Route()

    router
        .get('/', async (ctx, next) => {

        })
        .post('/users', async (ctx, next) => {

        })
        .put('/users/:id', async (ctx, next) => {

        })
        .del('/users/:id', async (ctx, next) => {

        })
        .all('/users/:id', async (ctx, next) => {

        })

    app.use(router.routes())
    app.listen(8080, () => {
        console.log('server is running at http://localhost:8080')
    })


```

#### 使用Decorator来装饰Koa的路由
* 概念
    * Decorator只能作用于类或类的方法上
    * 如果一个类和类的方法都是用了Decorator，类方法的Decorator优先于类的Decorator执行
