#### event loop
* js是单线程的
    * 在浏览器中，js和ui共用一个线程
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