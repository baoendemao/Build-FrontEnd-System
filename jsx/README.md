#### jsx
* jsx => javascript + xml
* 配置babel解析jsx
```
{
    test: /\.jsx?$/,
    loaders: ["babel-loader"],
    include: [
        __dirname + '/src',
    ]
}
```
* 解析规则：
    * 遇到 HTML 标签（以 < 开头），就用 HTML 规则解析
    * 遇到代码块（以 { 开头），就用 JavaScript 规则解析

