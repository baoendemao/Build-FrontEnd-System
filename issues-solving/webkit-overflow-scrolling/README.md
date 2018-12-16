#### -webkit-overflow-scrolling: touch
* -webkit-overflow-scrolling属性：auto和touch;
    * auto： 普通滚动，当手指从触摸屏上移开，滚动立即停止
    * touch：滚动回弹效果，当手指从触摸屏上移开，内容会保持一段时间的滚动效果，继续滚动的速度和持续的时间和滚动手势的强烈程度成正比。同时也会创建一个新的堆栈上下文。
* 为什么要引入这个属性？
    * 在ios上，scroll顺滑。这个属性是由苹果ios原生实现的，在浏览器里存在很多bug，暂时没有非常完美的解决方案
* 可能带来的问题
    * 卡着不能滑动
        * 重现：停止滚动，静待滚动条消失，此时滚动屏幕发现滚动不了
        * 暂时解决 => 可能在其他ios系统还存在此问题，需要再继续调研
        ```
            body, html {
                margin: 0;
                position: fixed;
            }

            document.addEventListener('touchmove',function (){
                document.body.scrollTop = 0
            });
        ```

        ```
            撑开高度
            min-height: calc(100% + 1px);
        ```

        ```
            z-index: 1;
        ```

        ```
            不把-webkit-overflow-scrolling设置在body元素上，而是在需要滚动的地方另外增加div容器去设定，然后把需要fixed的容器都直接放在body元素内
        ```

    * 白屏问题 
    ```
        // 不推荐，scroll不顺滑
        -webkit-overflow-scrolling: touch去掉，ios上的白屏问题消失
    ```

    ```
        // 不推荐，scroll不顺滑
        $("body").css('-webkit-overflow-scrolling','auto');
        $("body").scrollTop(9999);
        $("body").css('-webkit-overflow-scrolling','touch');
    ```

    ```
        // 不推荐，虽然可以解决白屏问题，但是GPU消耗过高，增加了内存的使用，out-of-memory会引起当前网页重载
        .background-img {
            transform: translate3d(0,0,0);  
        } 
        其中transfrom不可继承
    ```

    ```
      // 问题解决 => 滚动过程中大面积的白屏
      .scroll-touch {
        -webkit-overflow-scrolling: touch;
       }

      document.addEventListener('touchmove',function (){
        $('body').addClass('scroll-touch');
      });

      // 改成结束滚动的时候移除这个class
      document.addEventListener('touchend',function (){
         
          $('body').removeClass('scroll-touch');
       
      });
    ```
