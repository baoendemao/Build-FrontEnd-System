#### koa-bodyparse中间件
* koa-bodyparse中间件处理post请求，将post请求的请求体的formData解析到ctx.request.body中
```
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

app.use( async ( ctx ) => {

    if ( ctx.method === 'POST' ) {
        let postData = ctx.request.body;
        ctx.body = postData;
    } 
})

app.listen(3000)
console.log('server is starting at port 3000')

```