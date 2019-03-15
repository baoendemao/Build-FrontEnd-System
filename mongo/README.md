### mongoDB
#### 概念
* 文档
  * 相当于sql里的行
  * 文档中键是唯一的，键值对是有序的
* 集合
  * 一组文档，相当于sql里的一个表

#### mongo shell
```
$ mongo

> show dbs

```
* 例子
```
# 切换数据库
> use test

# users集合
> db.users.insert({username: "hello"})
WriteResult({ "nInserted" : 1 })

# 查询文档
# 其中：_id是文档的主键，这里是自动生成的
> db.users.find()
{ "_id" : ObjectId("5c8b50fe4290de2f0017daaf"), "username" : "hello" }

> db.users.save({username: "world"})
WriteResult({ "nInserted" : 1 })

# 查询users集合
> db.users.find()
{ "_id" : ObjectId("5c8b50fe4290de2f0017daaf"), "username" : "hello" }
{ "_id" : ObjectId("5c8b52aa4290de2f0017dab0"), "username" : "world" }

# 查询username是hello名字的
# 这里传入一个查询选择器，可以看到查询选择器也是一个文档
> db.users.find({username: "hello"})
{ "_id" : ObjectId("5c8b50fe4290de2f0017daaf"), "username" : "hello" }

# 更新操作：
# username是hello的文档中添加country
> db.users.update({username: 'hello'}, {$set: {country: 'Canada'}})
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
> db.users.find()
{ "_id" : ObjectId("5c8b50fe4290de2f0017daaf"), "username" : "hello", "country" : "Canada" }
{ "_id" : ObjectId("5c8b52aa4290de2f0017dab0"), "username" : "world" }

# 更新操作
# 去除上一步骤加入的country
> db.users.update({username: 'hello'}, {$unset: {country: 1}})
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
> db.users.find({username: 'hello'})
{ "_id" : ObjectId("5c8b50fe4290de2f0017daaf"), "username" : "hello" }

```