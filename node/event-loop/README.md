#### event loop
* js是单线程的
    * 在浏览器中，js和ui共用一个线程。所以如果脚本的执行时间超过100ms，用户就会觉得卡顿，以为网页停止响应。
    * 利用异步io，让单线程原理阻塞，更好的利用cpu, 来弥补单线程无法利用多核cpu的缺点
* task
    * macro task 宏任务
    ```
        setTimeout
        setInterval
        setImmediate
    ```
    * micro task 微任务
    ```
        Promise
        MutaionObserver
        process.nextTick
    ```
#### 轮询技术
* read
    * 重复调用来检查IO的状态来完成完整数据的读取，cpu一直在等待
* select
    * 通过对文件描述符的事件状态来进行判断数据是否读取完成
* poll
* epoll
    * 利用事件通知、执行回调的方式，而不是遍历查询，所以不会浪费cpu