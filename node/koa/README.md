### koa 待整理

#### koa1和koa2
* koa1
  * generator + yield 
* koa2
  * async / await


#### koa中间件
* koa中间件是基于洋葱模型的，可以在中间件中做请求前后的处理
  * 中间件是一个函数，两个参数：ctx和next
  * 参数next: 将中间件的执行权交给下游的中间件，next()返回的是一个Promise

* 通过例子简单了解中间件
  * 例子（1）通过app.use()加载中间件
  ```
    const koa = require('koa');
    const app = new koa();

    // 一个简单的中间件处理所有的请求
    app.use((ctx, next) => {
      ctx.response.type = 'text/html';
      ctx.response.body = '<div>hello world</div>';
    });

    // 启动服务
    app.listen(8080); 

  ```
  * 例子（2）如何抽象中间件
  ```
    const koa = require('koa');
    const app = new koa();

    app.use(async ctx => {
      console.log(ctx.method, ctx.host, ctx.url)
      ctx.body = 'hello world'  
    });

    app.listen(8080); 

  ```
    &nbsp; &nbsp; &nbsp; &nbsp; 如何将上面的console.log抽象成一个中间件:

  ```
    const koa = require('koa');
    const app = new koa();

    const logger = async (ctx, next) => {
      console.log(ctx.method, ctx.host, ctx.url)
      await next()
    }

    app.use(logger)

    app.use(async ctx => {
      ctx.body = 'hello world'  
    });

    app.listen(8080); 

  ```
  * 例子（3）获取服务器响应时间
  ```
    const koa = require('koa');
    const app = new koa();
    const compose = require('koa-compose');

    app.use(async (ctx, next) => {
      let startTime = new Date().getTime()

      await next()

      // 所有中间件执行完记录当前的时间
      let endTime = new Date().getTime()

      ctx.response.type = 'text/html'
      ctx.response.body = '<div>hello world</div>'
    })

    app.use(async (ctx, next) => {
      await next()
    })

    app.listen(8080)

  ```
  * 例子（4）如果没有next()，则后面的中间件不会执行
  ```
    const koa = require('koa');
    const app = new koa();

    app.use(async (ctx, next) => { 
      console.log('111 start');
      
      console.log('111 end');
    });

    app.use(async (ctx, next) => { 
      console.log('222 start');
      ctx.body = 'hello'
      await next(); 
      console.log('222 end');
    });

    app.use(async (ctx, next) => { 
      console.log('333 start');
      await next() ; 
      console.log('333 end');
    });

    app.listen(8080); 

    结果：
    111 start
    111 end


  ```

* 洋葱模型
  * 在当前中间件位于next()之后的代码会暂停执行，等到最后一个中间件执行完毕之后，才执行当前中间件位于next()之后的代码，例子如下：
  ```
    const koa = require('koa');
    const app = new koa();

    app.use(async (ctx, next) => { 
      console.log('111 start');
      await next();
      console.log('111 end');
    });

    app.use(async (ctx, next) => { 
      console.log('222 start');
      ctx.body = 'hello'
      await next(); 
      console.log('222 end');
    });

    app.use(async (ctx, next) => { 
      console.log('333 start');
      await next() ; 
      console.log('333 end');
    });

    app.listen(8080); 

    结果：
    111 start
    222 start
    333 start
    333 end
    222 end
    111 end

  ```
* koa-compose： 将多个中间件合并陈一个单一的中间件

```
  const koa = require('koa');
  const app = new koa();
  const compose = require('koa-compose');

  async function middleware_1(ctx, next) {
    console.log('111 start')
    await next()
    console.log('111 end')
  }

  async function middleware_2(ctx, next) {
    console.log('222 start')
    await next()
    console.log('222 end')
  }

  async function middleware_3(ctx, next) {
    console.log('333 start')
    await next()
    console.log('333 end')
  }

  const all = compose([middleware_1, middleware_2, middleware_3])
  app.use(all)

  app.listen(8080)


```

* 常用中间件
  * koa-bodyparser 中间件
    * 例子（1）使用koa-bodyparser中间件解析post请求body
    ```
      const koa = require('koa')
      const app = new koa()
      const bodyParser = require('koa-bodyparser')

      app.use(bodyParser())
      
      app.use(async ctx => {
        if (ctx.method == 'GET') {
          ctx.type = 'html'
          ctx.body = '<div>hello world</div>'
        } else if (ctx.method == 'POST') {
          ctx.body = ctx.request.body
        }
      })

      app.listen(8080)


    ```

  * koa-router中间件
    * 例子（1）
    ``` 
      const koa = require('koa')
      const app = new koa()
      const bodyParser = require('koa-bodyparser')
      const Router = require('koa-router')
      const router = new Router()

      router.get('/', (ctx, next) => {

      })

      router.post('/', (ctx, next) => {

      })

      app
        .use(bodyParser())
        .use(router.routes())
        .use(router.allowedMethods())

      app.listen(8080)

    ```
  * koa-static中间件
    * 用于加载静态资源，如js, css
  * koa-views中间件
    * 用于加载html模板

#### application
* application.js向外边暴露了一个class
* 继承了Emitter, 从而可以监听以及触发事件
```
module.exports = class Application extends Emitter {
 
  constructor() {
    super();

    this.proxy = false;
    this.middleware = [];
    this.subdomainOffset = 2;
    this.env = process.env.NODE_ENV || 'development';
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
    if (util.inspect.custom) {
      this[util.inspect.custom] = this.inspect;
    }
  }
}

```

#### Context
* koa的每个请求都将创建一个Context, 并在中间件中被作为参数使用
```
app.use(async ctx => {

})
```
* ctx.request  =>  koa的Request对象
  * get请求
    * 例子（1）获取get请求的参数
    ```
    const koa = require('koa');
    const app = new koa();

    app.use(async ctx => {
      ctx.response.body = {

        url: ctx.request.url,
        query: ctx.request.query,
        querystring: ctx.request.querystring

      }  
    });

    app.listen(8080); 

    get请求：
    curl http://127.0.0.1:8080/articles?id=1234

    结果：
    {
      "url": "/articles?id=1234",
      "query": {
        "id": "1234"
      },
      "querystring": "id=1234"
    }
    ```
    * 例子（2）判断请求是get请求还是post请求
    ```
      const koa = require('koa');
      const app = new koa();

      app.use(async ctx => {
        if (ctx.request.method === 'POST') {

        } else if (ctx.request.method === 'GET') {

          // 处理路由 （ 通常使用koa-router ）
          if (ctx.request.path != '/' ) {
            ctx.response.type = 'html';
            ctx.response.body = 'This is not 首页';
          } else {
            ctx.response.body = 'This is 首页';
          }
        }
        
      });

      app.listen(8080); 
    ```
  * post请求
    * 例子（1）
    ```

    const koa = require('koa');
    const app = new koa();

    app.use(async ctx => {
      let postData = '';

      // 监听data事件
      ctx.req.on('data', (data) => {
        postData += data;
      });

      ctx.req.on('end', () => {
        console.log(postData)
      });
    });

    app.listen(8080); 

    post请求：
    curl -d  "id=123"  "http://localhost:8080/"

    结果：
    id=123

    ```
* ctx.response => koa的Response对象
  * ctx.response.type 设置响应的数据类型
  ```
    const koa = require('koa');
    const app = new koa();

    app.use(async ctx => {

      // 设置响应状态码
      ctx.response.status = 200;

      // 客户端期望的数据类型
      if (ctx.request.accepts('json')) {

        ctx.response.type = 'json';
        ctx.response.body = {
          data: 'hello world'
        }

      } else if (ctx.request.accepts('html')) {

        ctx.response.type = 'html';
        ctx.response.body = '<div>hello world</div>';

      } else {

        ctx.response.type = 'text';
        ctx.response.body = 'hello world';

      }
      
    });

    app.listen(8080); 

  ```

* ctx.state
  * 命名空间，可以将一些属性放在ctx.state中，来被另一个中间件读取

* ctx.cookies
  * ctx.cookies.get()
  * ctx.cookies.set()

* ctx.throw
  * 抛出错误
  ```
    app.use(async ctx => {
      ctx.throw(500)
    });

  ```

#### 渲染html

##### （1）赋值koa context body
```
const ejs = require('ejs')
const { commonTpl } = require('./template/index');

app.use(async(ctx, next) => {
  ctx.type = 'text/html; charset=utf-8';
  ctx.body = commonTpl;
})


```
##### （2）通过ejs模块渲染html
```
const ejs = require('ejs')
const { ejsTpl } = require('./template/index');

app.use(async(ctx, next) => {
  ctx.type = 'text/html; charset=utf-8';
  // ejs模板渲染
  ctx.body = ejs.render(
    ejsTpl, 
    {
      name: 'this is name',
      desp: 'this is desp'
    }
  )
})

```
##### （3）通过koa-views渲染html
```
const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const { resolve } = require('path');

// views中间件的集成, 将模板挂在到了context上下文
app.use(views(resolve(__dirname, 'views'), {
	extension: 'ejs'
}));


// async await
app.use(async (ctx, next) => {
	await ctx.render('index', {
		name: 'this is name',
		desp: 'this is desp'
	});
});


```