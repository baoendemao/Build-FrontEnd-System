#### cluster
* cluster
    * cluster可以使得node充分利用多核CPU
    * 两种进程： master进程和work进程, 可以根据cpu的个数来决定fork出多少数量的work进程
    * 进程间通信：每个worker进程通过IPC（Inter-Process Communication，进程间通信）来实现和master进程间通信。<br/>
        进程间通信的5种方式：
        * 管道：速度慢，容量有限，只有父子进程能通讯    
        * FIFO：任何进程间都能通讯，但速度慢    
        * 消息队列：容量受到系统限制，且要注意第一次读的时候，要考虑上一次没有读完数据的问题    
        * 信号量：不能传递复杂消息，只能用来同步    
        * 共享内存区：能够很容易控制容量，速度快，但要保持同步，比如一个进程在写的时候，另一个进程要注意读写的问题，相当于线程中的线程安全，当然，共享内存区同样可以用作线程间通讯，不过没这个必要，线程间本来就已经共享了同一进程内的一块内存


* cluster模块API
    * cluster对象
    ```
        cluster.setttings:配置集群参数对象
        cluster.isMaster:判断是不是master节点
        cluster.isWorker:判断是不是worker节点
        Event: 'fork': 监听创建worker进程事件
        Event: 'online': 监听worker创建成功事件
        Event: 'listening': 监听worker向master状态事件
        Event: 'disconnect': 监听worker断线事件
        Event: 'exit': 监听worker退出事件
        Event: 'setup': 监听setupMaster事件
        cluster.setupMaster([settings]): 设置集群参数
        cluster.fork([env]): 创建worker进程
        cluster.disconnect([callback]): 关闭worket进程
        cluster.worker: 获得当前的worker对象
        cluster.workers: 获得集群中所有存活的worker对象
    ```

    * worker对象
    ```
        worker.id: 进程ID号
        worker.process: ChildProcess对象
        worker.suicide: 在disconnect()后，判断worker是否自杀
        worker.send(message, [sendHandle]): master给worker发送消息。注：worker给发master发送消息要用process.send(message)
        worker.kill([signal='SIGTERM']): 杀死指定的worker，别名destory()
        worker.disconnect(): 断开worker连接，让worker自杀
        Event: 'message': 监听master和worker的message事件
        Event: 'online': 监听指定的worker创建成功事件
        Event: 'listening': 监听master向worker状态事件
        Event: 'disconnect': 监听worker断线事件
        Event: 'exit': 监听worker退出事件
    ```
* cluster实现负载均衡 * [demo点这里](https://github.com/baoendemao/front-end-engineering/tree/master/node/cluster/demos/app.js)
    * 浏览器端每次运行localhost:3000都会随机分配到不同的work进程

