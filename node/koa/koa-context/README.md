#### koa context
* koa的每个请求都将创建一个Context, 并在中间件中被作为参数使用
    ```
        app.use(async ctx => {

        })
    ```
* ctx.body
    * 发送的html
* ctx.type
    * 如 ctx.type = "text/html; charset=utf-8"
* ctx.req
    * ctx.req是context提供的node原生http请求对象
* ctx.res
    * ctx.res是context提供的node原生http响应对象
* 获取请求参数
    * ctx.request.query
        * 返回对象的形式。例如：如果url为xxx.com?x=1&y=2，则ctx.request.query为{x:1, y:2}
    * ctx.request.querystring
        * 返回字符串的形式。例如：如果url为xxx.com?x=1&y=2，则ctx.request.query为x=1&y=2
    * ctx.query
        * 同ctx.request.query, ctx对request对象的api直接引用
    * ctx.querystring
        * 同ctx.request.querystring, ctx对request对象的api直接引用
* ctx.cookies
    * ctx.cookies.get(name, [options]) 
    * ctx.cookies.set(name, value, [options]) 


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

* ctx.throw
  * 抛出错误
  ```
    app.use(async ctx => {
      ctx.throw(500)
    });

  ```
