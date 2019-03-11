### mongoose
#### 官方文档 
* https://mongoosejs.com/docs/index.html
#### 原理
* schema
```
// 定义一个schema
var userSchema = new mongoose.Schema({
  name: String   
});

```
* model
  * schema发布生成model
  ```
    var UserModel = mongoose.model('User', userSchema);
  ```
* entity
  * model创建的实体
  ```
    var userEntity = new UserModel({name: 'hello'});
   
    console.log(userEntity.name);   // hello

  ```