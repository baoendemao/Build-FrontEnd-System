### node待整理

#### node的全局对象
* global
* process
* Buffer
* require
* console

#### net => TCP客户端和服务端库
* 例子
  * 例子（1）聊天室
  ```
    
    var net = require('net')

    var count = 0
      , users = {}


    var server = net.createServer(function (conn) {
      conn.write(
          '\n > welcome to \033[92mnode-chat\033[39m!'
        + '\n > ' + count + ' other people are connected at this time.'
        + '\n > please write your name and press enter: '
      );
      count++;

      conn.setEncoding('utf8');

      var nickname;

      function broadcast (msg, exceptMyself) {
        for (var i in users) {
          if (!exceptMyself || i != nickname) {
            users[i].write(msg);
          }
        }
      }

      conn.on('data', function (data) {
        data = data.replace('\r\n', '');

        if (!nickname) {
          if (users[data]) {
            conn.write('\033[93m > nickname already in use. try again:\033[39m ');
            return;
          } else {
            nickname = data;
            users[nickname] = conn;

            broadcast('\033[90m > ' + nickname + ' joined the room\033[39m\n');
          }
        } else {
          broadcast('\033[96m > ' + nickname + ':\033[39m ' + data + '\n', true);
        }
      });

      conn.on('close', function () {
        count--;
        delete users[nickname];
        broadcast('\033[90m > ' + nickname + ' left the room\033[39m\n');
      });
    });


    server.listen(3000, function () {
      console.log('\033[96m   server listening on *:3000\033[39m');
    });

    运行：
    telnet 127.0.0.1 3000

  ```

#### dns => 域名解析库
* 例子
  * dns.lookup: 根据域名获取ip地址
    ```
      var dns = require('dns')

      dns.lookup('www.xxx.com', (err, ip) => {
        if (err) throw err;
        console.log(ip)
      })

    ```
  * dns.reverse：根据ip地址获取域名
    ```
      var dns = require('dns')

      dns.reverse('55.222.88.11', (err, domains) => {
        if (err) throw err;
        console.log(domains)
      })

    ```
  * dns.resolve: 根据指定的记录类型返回一组记录
    ```
      var dns = require('dns')

      dns.resolve('www.xxx.com', 'NS', (err, domains) => {
        console.log(domains)
      } )

    ```
#### http
* http服务器与客户端模块
* http.createServer

#### https

#### fs
* fs模块同时提供了同步和异步API
* 例子
  * 例子（1）fs命令行工具
  ```

    var fs = require('fs'), 
      stdin = process.stdin, 
      stdout = process.stdout

    fs.readdir(__dirname, function (err, files) {
      console.log('');

      if (!files.length) {
        return console.log('    \033[31m No files to show!\033[39m\n');
      }

      console.log('   Select which file or directory you want to see\n');

      var stats = {};

      function file(i) {
        var filename = files[i];

        fs.stat(__dirname + '/' + filename, function (err, stat) {
          stats[i] = stat;

          if (stat.isDirectory()) {
            console.log('     '+i+'   \033[36m' + filename + '/\033[39m');
          } else {
            console.log('     '+i+'   \033[90m' + filename + '\033[39m');
          }

          if (++i == files.length) {
            read();
          } else {
            file(i);
          }
        });
      }

      function read () {
        console.log('');
        stdout.write('   \033[33mEnter your choice: \033[39m');

        stdin.resume();
        stdin.setEncoding('utf8');
        stdin.on('data', option);
      }

      function option (data) {
        var filename = files[Number(data)];
        if (!filename) {
          stdout.write('   \033[31mEnter your choice: \033[39m');
        } else {
          stdin.pause();

          if (stats[Number(data)].isDirectory()) {
            fs.readdir(__dirname + '/' + filename, function (err, files) {
              console.log('');
              console.log('   (' + files.length + ' files)');
              files.forEach(function (file) {
                console.log('     -   ' + file);
              });
              console.log('');
            });
          } else {
            fs.readFile(__dirname + '/' + filename, 'utf8', function (err, data) {
              console.log('');
              console.log('\033[90m' + data.replace(/(.*)/g, '     $1') + '\033[39m');
            });
          }
        }
      }

      file(0);
    });



  ```

#### path
* 提供处理路径的工具函数

#### url
* url.parse
```
  var url = require('url')
  var o = url.parse('http://www.xxx.com/index.html?a=1&b=2')
  console.log(o)

```
* url.format
```
  var url = require('url')

  var url_obj = url.parse('http://www.xxx.com/index.html?a=1&b=2')
  console.log(url_obj)

  var url_str = url.format(url_obj)
  console.log(url_str)

```

#### querystring
* querystring.parse
```
  var querystring = require('querystring')

  var vals = querystring.parse('a=1&b=2&c=3')
  console.log(vals)

  运行结果：
  { a: '1', b: '2', c: '3' }

```
* querystring.stringify
```

  var querystring = require('querystring')

  var vals = querystring.parse('a=1&b=2&c=3')
  console.log(vals)

  var vals_str = querystring.stringify(vals)
  console.log(vals_str)

  运行结果：
  { a: '1', b: '2', c: '3' }

  a=1&b=2&c=3

```
#### os => 查询平台信息的操作系统库


#### assert => 写测试断言库

#### events 事件触发器
* 例子
  * 例子（1）
  ```
    let events = require('events')
    let em = new events.EventEmitter

    em.on('aaa', function() {
      console.log('aaa event 来啦')
    })

    // 事件分发
    em.emit('aaa')

    运行结果：
    aaa event 来啦

  ```

#### Error 异常
* try catch捕获异常
  * 例子（1）try catch捕获以后才会执行的函数的异常，捕获不到
  ```
    try {
      setTimeout(function(){
        throw new Error('hello')
      }, 10000)
    } catch(e) {
      console.log(e)
    }

  ```
* uncaughtException
  * Node对于未捕获异常的默认处理是：会触发 uncaughtException 事件。如果 uncaughtException 没有被监听，那么会打印异常的堆栈信息，且触发进程的 exit 事件
  * 监听uncaughtException事件
  ```
    process.on('uncaughtException', (err) => {
      console.log(err);
      console.log("捕捉到异常啦");
    });

    // 引用没有声明的变量
    console.log(o);

  ```



#### global 全局变量
* 全局
  * REPL中的全局
  ```
    > var a = 123
    undefined
    > global.a
    123

  ```
  * node模块中的全局
    * 仅仅在该模块中是全局的，在其他模块中不可见。
    * 只有显示导出的才可以被其他模块使用

#### process 进程
* 概述：
  * 提供关于进程标识，当前运行环境
  ```
    > process.execPath
    '/usr/local/bin/node'

    > process.version
    'v10.13.0'

    > process.platform
    'darwin'

  ```
* process.nextTick
  * 例子（1）
  ```
    console.log(123)

    process.nextTick(() => console.log(456))

    console.log(789)

    // 运行结果
    123
    789
    456
  ```

* 三个流对象：process.stdin, process.stdout, process.stderr
  * 分别对应unix标准流：标准输入，标准输出，标准错误
  * process.stdin
    * 异步
    * 可读
  * process.stdout
    * 异步
    * 可写
  * process.stderr
    * 同步可阻塞流
  * 例子
    * 例子（1）
    ```
      process.stdin.resume()
      process.stdin.pipe(process.stdout)

      运行结果：
      你输入的任何信息将立即回显给你
      
    ```
* process.argv
  * 例子
    * 例子（1）
    ```
      console.log(process.argv);

      运行：
      node argv/example.js

      运行结果：返回启动 Node.js 进程时传入的命令行参数
      [ '/usr/local/bin/node',
        'xxx/argv/example.js' ]
    ```

* process.cwd 
  * process.cwd和__dirname的区别: 
    * process.cwd: 起node进程的工作目录
    * __dirname: 执行文件所在目录
  ```
    // index.js
    console.log(__dirname)
    console.log(process.cwd())

    运行：
    /xxx/yyy $ node zzz/www/index.js

    运行结果是：
    /xxx/yyy/zzz/www
    /xxx/yyy

  ```

* process.env
  * 例子
    * 例子（1）
    ```
      // index.js
      console.log(process.env.NODE_ENV)

      运行：
      NODE_ENV='production' node index

      运行结果：
      production

    ```
  
* process.exit
```
  // 退出程序
  process.exit(1)

```

#### child_process 子进程
* child_process.spawn() 异步地衍生子进程，且不阻塞 Node.js 事件循环
  * 例子: 启动一个新的子进程，在子进程中执行shell命令
  ```
    var spawn = require('child_process').spawn
    var pwd = spawn('pwd')

    pwd.stdout.setEncoding('utf8')
    pwd.stderr.setEncoding('utf8')


    pwd.stdout.on('data', (data) => {
      console.log('stdout: ')
      console.log(data)
    })

    pwd.stderr.on('data', (data) => {
      console.log('stderr: ')
      console.log(data)
    })

    pwd.on('exit', (code) => {
      console.log('child process exited with code:  ' + code)
    })
  ```
* child_process.exec和child_process.execFile 启动shell执行命令
  * child_process.exec  执行一条命令
  * child_process.execFile 执行一个可执行文件，而不是运行一条命令
  * 例子
  ```
    // app.js
    #!/usr/local/bin/node
    console.log('hello world')

    // test.js
    var execfile = require('child_process').execFile
    var child = execfile('./app.js', (err, stdout, stderr) => {
      if (!err) {
        console.log(stdout)
      }
    })


    运行： node test.js

  ```

* child_process.fork
  * 启动子进程，其实是对spawn方法的封装

#### Buffer 缓冲器
* 例子
  * 例子（1）
  ```
    let mybuffer = new  Buffer('R0lGODlhFgAYAIAAAHbRSv///yH5BAAHAP8ALAAAAAAWABgAAAI2jI8AyH0Kl3MxzlTzzBziDkphaIxgaXJoWq2sF7xtLMO1fYu5K/Ovz/qkNqPLQ2UUKpIUyaQAADs===ii1j2i3h1i23h', 'base64');

    let f = require('fs');

    f.writeFile('./logo.gif', mybuffer, '', function() {} );

    运行：
    open ./logo.gif


  ```
#### child_process
* 子进程：解决单线程无法利用多核cpu的问题，将计算分发给各个子进程，再通过进程之间的事件消息来传递结果
* 通过master-worker管理方式，可以很好的管理各个工作进程

#### readline 逐行读取
* 例子
  * 例子（1）readline的interface实例来按行读取
  ```
    var readline = require('readline')
    // 创建一个readline的interface实例
    var interface = readline.createInterface(process.stdin, process.stdout, null)

    interface.question('>> what is the meaning of life? ', (answer) => {
      console.log('About the meaning of life , you said ' + answer)
      interface.setPrompt('>>')
      interface.prompt()
    })

    function closeInterface() {
      console.log('Leaving interface')  
      process.exit()
    }

    // 监听line事件
    interface.on('line', (cmd) => {
      if (cmd.trim() == '.leave') {
        closeInterface()
        return
      } else {
        console.log('repeating command: ' + cmd)
      }
      interface.setPrompt('>>')
      interface.prompt()
    })

    // 监听close事件
    interface.on('close', () => {
      closeInterface()
    })

  ```

