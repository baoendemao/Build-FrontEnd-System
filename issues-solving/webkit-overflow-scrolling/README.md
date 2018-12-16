#### -webkit-overflow-scrolling: touch
* 为什么要引入这个属性？
    * 在ios上，scroll顺滑。这个属性是由苹果ios原生实现的，在浏览器里存在很多bug，暂时没有非常完美的解决方案
* 可能带来的问题
    * 卡着不能滑动
        * 重现：停止滚动，静待滚动条消失，此时滚动屏幕发现滚动不了
        * 暂时解决 => 可能在其他ios系统还存在此问题，需要再继续调研
        ```
            document.addEventListener('touchmove',function (){
                document.body.scrollTop = 0
            });
        ```

        ```
            撑开高度
        ```

        ```
            z-index: 1;
        ```

    * 白屏问题 
