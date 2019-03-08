### koa 待整理

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