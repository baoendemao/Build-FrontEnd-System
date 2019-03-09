### koa 待整理

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

#### context

#### request

#### response

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