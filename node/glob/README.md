### glob 
获取匹配对应正则的文件数组

```
const glob = require('glob');

// options 是可选的
// files 是匹配到的文件的数组
// 如果 `nonull` 选项被设置为true, 而且没有找到任何文件, 那么files就是glob规则本身, 而不是空数组
glob("**/*.js", options, function (err, files) {
  
})

```
* glob.sync( ) 同步读取



#### 例子
* webpack.config.js中获取指定路径下的入口文件
```
// 获取指定路径下的入口文件
function getEntries(globPath) {
    var files = glob.sync(globPath),
      entries = {};
 
    files.forEach(function(filepath) {
      var split = filepath.split('/');
      var name = split[split.length - 2];
      var entity = [];
      entity.push('./' + filepath);
      entries[name] = entity;
    });
 
    return entries;
}


```

* \* 匹配该路径段中0个或多个任意字符
```

// 获取js目录下的所有js文件
glob("js/*.js",function (err, files) {
  console.log(files)
})

```
* \? 匹配该路段中1个任意字符
```

// 获取js目录下所有名字只有1个字的js
glob("js/?.js",function (er, files) {
  console.log(files)
})

```
* [ ] 匹配该路径段中在指定范围内字符
```
// 获取js目录下a开头，第二个字符为0-3之间的js
glob("js/a[0-3].js",function (er, files) {
  console.log(files)
})

```
