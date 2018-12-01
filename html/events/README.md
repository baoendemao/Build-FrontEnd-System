#### 移动端触屏事件
* touchstart
```
    document.addEventListener('touchstart', function(){

    }, false)
```

* touchmove
* touchend

* mousedown
* mouseup
* mousemove

* click

* 在移动端事件的顺序是由不同的行为决定的
    * 点击鼠标不松手，并滑动，最后松开鼠标。时间先后顺序：
    ```
        touchstart >  touchmove > touchend
    ```
    
    ```
        touchstart > click > touchmove > touchend
    ```
    * 长按松手
    ```
        touchstart > touchmove > touchend > mousemove > mousedown > mouseup > click
    ```