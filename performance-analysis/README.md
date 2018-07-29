### 前端性能分析
#### window.performance对象
* performance.timing<br/>
一个页面加载到浏览器中经历的过程都可以通过performance.timing来获取, 各个时间点如下图所示：<br/>


 ![image](https://github.com/baoendemao/front-end-engineering/blob/master/images/timing-overview.png)

 ```
    let timing = performance.timing,

    // 准备新页面时间耗时
    readyStart = timing.fetchStart - timing.navigationStart,

    // redirect 重定向耗时
    redirectTime = timing.redirectEnd - timing.redirectStart,

    // Appcache 耗时
    appcacheTime = timing.domainLookupStart - timing.fetchStart,

    // unload 前文档耗时
    unloadEventTime = timing.unloadEventEnd - timing.unloadEventStart,

    // DNS 查询耗时
    lookupDomainTime = timing.domainLookupEnd - timing.domainLookupStart,

    // TCP连接握手耗时
    connectTime = timing.connectEnd - timing.connectStart,

    // request请求耗时
    requestTime = timing.responseEnd - timing.requestStart,

    // 请求完毕至DOM加载
    initDomTreeTime = timing.domInteractive - timing.responseEnd,

    // 解析DOM树耗时
    domReadyTime = timing.domComplete - timing.domInteractive,

    // load事件耗时
    loadEventTime = timing.loadEventEnd - timing.loadEventStart,

    // 加载时间耗时
    loadTime = timing.loadEventEnd - timing.navigationStart;


 ```

 * performance.getEntries()
    * 获取页面中加载的所有的http资源