#### event loop
* js是单线程的
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