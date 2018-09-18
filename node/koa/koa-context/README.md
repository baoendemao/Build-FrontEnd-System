#### koa context
* ctx.body
* ctx.request
    * context经过封装的请求对象
* ctx.response
    * context经过封装的响应对象
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