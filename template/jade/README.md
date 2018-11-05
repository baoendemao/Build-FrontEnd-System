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