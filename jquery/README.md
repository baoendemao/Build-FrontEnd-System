#### jquery
* github地址： https://github.com/jquery/jquery
* 特点：
    * 链式操作
    * 回调函数
    * 迭代器
    * 延迟对象
    * 队列

#### API
* $(document).ready
    * 等待dom都加载完毕后，再执行后续的代码
* jquery的dom对象 
    * 不同于原生的dom对象
    * 是一个类数组对象
* jquery对象和dom对象的互相转换
    * jquery对象 => dom对象
    ```
        var jq_div = $('div')                                 // jquery对象
        var o_div = jq_div[0] 或者 var o_div = jq_div.get(0)   // 获取真实的dom对象
        o_div.style.color = 'blue'                            // 操作dom对象的属性
    ```

    * dom对象 => jquery对象
    ```
        var o_div = document.getElementsByTagName('div')    // dom对象
        var jq_div = $(o_div)                               // jquery对象集合
        var jq_first_div = $(o_div).first()                 // jquery对象数组的第一个元素
        jq_first_div.css('color', 'blue')                   // jquery对象设置颜色
    ```

* 选择器 $
    * html元素选择器
        * $('h1') 获得jquery的dom对象
        * $('h1').html('hello world') 修改内容
        * $('h1').html('hello world').css('color', 'blue')  修改颜色
    * id选择器
        * $('#app')
    * 类选择器 => 可以选择一个或者多个元素
        * $('.container')
    * 全部元素选择器
        * $('*')
    * 子选择器、后代选择器、相邻兄弟选择器、一般兄弟选择器
        * $('parent > child') 其中parent和child是直接父子关系
        * $('ancestor descendant') 
        * $('prev + next')  其中prev和next是相邻兄弟
        * $('prev ~ siblings') 其中siblings匹配prev的所有兄弟
        * $(':first-child')   选择所有父级元素下的第一个子元素
        * $(':last-child')   选择所有父级元素下的最后一个子元素
        * $(':only-child')   如果某个元素是其父元素的唯一子元素，那么它就会被选中
        * $(':nth-child')   选择所有父元素的第n个子元素
        * $(':nth-last-child')   选择所有父元素的第n个子元素，计数倒着数
    * 筛选选择器
        * $(':first')           匹配第一个元素
        * $(':last')            匹配最后一个元素
        * $(':not(selector)')   选择所有元素去除不匹配给定的选择器的元素
        * $(':eq(index)')       匹配的集合中选择索引值为index的元素
        * $(':gt(index)')       匹配集合中所有大于给定index的元素
        * $(':lt(index)')       匹配集合中所有索引值小于给定index的元素
        * $(':even')            索引值为偶数，索引从0开始计数
        * $(':odd')             索引值为奇数，索引从0开始计数
        * $(':header')          选择所有标题元素
        * $(':lang(language)')  选择指定语言的所有元素
        * $(':root')            选择文档的根元素
        * $(':animated')        选择正在执行动画效果的元素
    * 内容筛选选择器
        * $(':contains(text)')  选择所有包含指定文本的元素
        * $(':parent')          选择所有含有子元素或者文本的元素
        * $(':empty')           选择所有没有子元素的元素，包含文本节点
        * $(':has(selector)')   选择元素中至少包含指定选择器的元素
    * 可见性筛选选择器
        * $(':visible')         选择所有显示的元素，包含visibility: hidden和opacity: 0， 因为它们仍然占据空间
        * $(':hidden')          选择所有隐藏的元素
            * display: none
            * 表单元素type='hidden'
            * 宽度高度都设置为0
    * 属性选择器
        * $("[attribute|='value']") 
        * $("[attribute*='value']")   
        * $("[attribute~='value']")   
        * $("[attribute='value']")   
        * $("[attribute!='value']")   
        * $("[attribute^='value']")  
        * $("[attribute$='value']")  
        * $("[attribute]")             
    * 表单元素选择器
        * $(':input')
        * $(':text')
        * $(':password')
        * $(':radio')
        * $(':checkbox')
        * $(':submit')
        * $(':image')
        * $(':reset')
        * $(':button')
        * $(':file')
    * 表单对象属性选择器
        * $(':enabled')
        * $(':disabled')
        * $(':checked')
* attr() => 获取attribtues使用attr(),  获取property使用prop()
    * attr(属性名字)    获取属性的值
    * attr(属性名字，属性值)    设置属性的值
    * attr(属性名字，函数值)    设置属性的函数值
    * attr(attributes)       给指定元素设置多个属性值
* removeAttr()
    * 为匹配的元素集合中的每个元素中移除一个属性