#### jade
* 可读性好
* 灵活易用的缩进
* 块扩展
* 代码默认经过编码处理，以增强安全性
* 编译及运行时的上下文错误报告
* 命令行编译支持
* html5模式
* 可选的内存缓存
* 联合动态的静态标记类
* 利用过滤器解析树的处理

#### 全局安装jade命令
```
$ sudo npm install jade -g
$ jade -h

```
<br/>

#### 入门示例 [demo点这里](https://github.com/baoendemao/front-end-engineering/tree/master/template/jade/demos)

```

# 编译jade
$ jade jade/demos/index.jade
# rendered jade/demos/index.html

$ cat jade/demos/index.jade
doctype html
html
  head
    title study jade
  body
    h1 hello world

# 编译以后的结果是压缩后的
$ cat jade/demos/index.html
<!DOCTYPE html><html><head><title>study jade</title></head><body><h1>hello world</h1></body></html>

# -P可以编译出没有压缩的
$ jade -P jade/demos/index.jade

$ cat jade/demos/index.html
<!DOCTYPE html>
<html>
  <head>
    <title>study jade</title>
  </head>
  <body>
    <h1>hello world</h1>
  </body>
</html>

# -w表示实时编译
$ jade -P -w jade/demos/index.jade
```

#### jade语法
* 父子缩进
* 标签后面跟着文本, 如：

```

h1 hello world

会被编译成

<h1>hello world</h1>

```

* 注释
```
// h1 hello world

会被编译成

<!-- h1 hello world -->
```

```
//- h1 hello world

这种注释叫做非缓冲注释，编译后

在Html中不会输出
```

```
多行注释

//-
  p 
    line one
    line two
    line three
```

* 属性，如class，id

```

h1.title hello world

会被编译成

<h1 class="title">hello world</h1>

```

```
h1.title.active#el 

会被编译成

<h1 id="el" class="title active"><h1>

```

```
#el.title

此时没有写标签，会默认作为div里处理，所以被编译成

<div id="el" class="title"></div>
```

```
div.title.active(id="app", class="detail") hello world

会被编译成

<div id="app" class="title active detail">hello world</div>
```

* a标签

```
a(href='http://xxx.com', title="hello world", data-uid="123") hello world

会被编译成

<a href="http://xxx.com" title="hello world"  data-uid="123">hello world</a>

```

* input标签
```
input(name="type", type="checkbox", checked)

会被编译成

<input name="type"  type="checkbox"  checked>

```

* 多行文本换行的情况<br/>

方法1：使用竖线 <br/>
```
p
  | line one
  | line two
  | line three

会被编译成

<p>
  line one
  line two
  line three
</p>
```

```
p
  | line one
  span line two

会被编译成

<p>
  line one
  <span>line two</span>
</p>

```

方法2：使用点 <br/>
```
p.
  line one
  line two
  line three

会被编译成

<p>
  line one
  line two
  line three
</p>
```

* 如何在script标签里定义变量

```
script.
  var s = 'hello world';

```
* 如何在style标签里定义样式
```
style.
  div { background: blue; }
```

* 声明变量
```
- var s = 'hello world'
div #{s}

被编译成

<div>hello world<div/>
```

```
- var s = 'hello world'
div #{s.toUpperCase()}

被编译成

<div>HELLO WORLD</div>
```
* 变量的转义 => jade默认是自动转义的，叹号！表示非转义
```
- var s = 'hello world'
- var s_html = '<script>console.log(123)</script>'

div #{s}
div #{s_html}
div !{s_html}
div= s
div= s_html
div!= s_html
div \!{s_html}

将会被编译成

<div>hello world</div>

<div>&lt;script&gt;console.log(123)&lt;/script&gt;</div>

<div><script>console.log(123)</script></div>

<div>hello world</div>

<div>&lt;script&gt;console.log(123)&lt;/script&gt;</div>

<div><script>console.log(123)</script></div>

<div>!{s_html}</div>
```

```
前提：s没有被定义

input(value=s) 被编译成 <input>


input(value='#{s}') 被编译成 <input value="undefined">

```

* if-else
```
- var i = 2
- var active = true
  if active
    if i <=2
      p hello
    else 
      p world

会被编译成

<p>
  hello
</p>

```

* for-in
```
- var student = {name: 'hello', age: '10'}

- for (var k in student)
  p= student[k]

会被编译成

<p>hello</p>
<p>10</p>

```

* for-each

```
- var student = {name: 'hello', age: '10'}

- each value, key in student
  p #{key}: #{value}

会被编译成

<p>name: hello</p>
<p>age: 10</p>

```

```
- var arr = [123, 456, 789]
- each item in courses
  p= item

会被编译成

<p>123</p>
<p>456</p>
<p>789</p>

```

* while
```
- var i = 0;
ul
  while i < 2
    li= i++

被编译成

<ul>
  <li>0</li>
  <li>1</li>
</ul>

```
* case-when
```
- var s = 'hello'
case s
  when 'hello'
    p hello
  when 'world'
    p world
  default
    p hello world
```

* mixin => 代码重用
```
mixin hello
  p hello world

mixin的调用：
+hello

会被编译成

<p>hello world</p>

```

```
mixin hello(name, age)
  p #{name}
  p #{age}

+hello('hello', 10)

会被编译成

<p>hello</p>
<p>10</p>

```

```
mixin hello(name)
  p #{name}
  if age
    p #{age}
  else 
    p no age

+hello('hello')
  p 10

会被编译成
<p>hello</p>
<p>10</p>

```

```
mixin hello(name)
  p&attributes(attributes) #{name}

+hello('hello')(class='active', id='app')

会被编译成
<p id="app" class="active">hello</p>

```

```
mixin hello(name)
  p(class=!attributes.class) #{name}


// 传递属性class，可以通过attributes.class取到
+hello('hello')(class='active')


会被编译成
<p class="active">hello</p>

```


```
// 当参数个数不确定
mixin hello(name, ...items)
  ul(class='#{name}')
    each item in items
      li= item

+hello('hello', 'welcome', 'world', 'frontend')

会被编译成
<ul class="hello">
  <li>welcome</li>
  <li>world</li>
  <li>frontend</li>
</ul>

```

* jade的模板继承 
```
// hello.jade
block hello
  p inside hello


// world.jade
// 继承hello.jade
extends hello

block world
  p inside world

会被编译成
<p>inside hello</p>
<p>inside world</p>
```

#### jade api
* jade.compile(source, options)
* jade.compileFile(path, options)
* jade.compileClient(source, options)
* jade.render(source, options)
* jade.renderFile(filename, options)