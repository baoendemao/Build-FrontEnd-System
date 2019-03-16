### mongoDB
#### 概念
* 文档
  * 相当于sql里的行
  * 文档中键是唯一的，键值对是有序的
  * 每个文档都有一个键 id
* 集合
  * 一组文档，相当于sql里的一个表

#### mongo shell
 
* 启动
```
# 如果mongod不带参数，则默认使用目录/data/db
# 所以如果/data/db不存在，需要自行创建
$ mongod

# 连接本地
$ mongo

# 连接远程数据库
$ mongo xxx-host:30000/dbname

# 启动mongo shell, 且不连接任何数据库
$ mongo --nodb

# list数据库
> show dbs

> help

```

* 查看当前指向哪个数据库
```
> db
```

* 切换数据库
```
> use test
> db
test

```
* 创建操作
```
# 将一条文档插入到users集合中
> db.users.insert({username: "hello"})
WriteResult({ "nInserted" : 1 })
```
* 查询
    * find
    * findOne
    ```
        # 查询users集合
        > db.users.find()
        { "_id" : ObjectId("5c8bbf30d99f878686a2da28"), "username" : "hello" }
        { "_id" : ObjectId("5c8bc116d99f878686a2da29"), "username" : "world" }

        # 若只想查看一个文档，使用findOne
        > db.users.findOne()
        { "_id" : ObjectId("5c8bbf30d99f878686a2da28"), "username" : "hello" }

        # 查询username是hello名字的
        # 这里传入一个查询选择器，可以看到查询选择器也是一个文档
        > db.users.find({username: "hello"})

    ```
* 更新
    * 通过例子简单了解更新操作
        * 例子（1）
        ```
            > db.users.find()
            { "_id" : ObjectId("5c8bbf30d99f878686a2da28"), "username" : "hello" }
            { "_id" : ObjectId("5c8bc116d99f878686a2da29"), "username" : "world" }

            > a.city = 'beijing'
            beijing

            # 将username等于beijing，更新
            > db.users.update({username: 'beijing'}, a)
            WriteResult({ "nMatched" : 0, "nUpserted" : 0, "nModified" : 0 })

            > db.users.find()
            { "_id" : ObjectId("5c8bbf30d99f878686a2da28"), "username" : "hello" }
            { "_id" : ObjectId("5c8bc116d99f878686a2da29"), "username" : "world" }

            > db.users.update({username: 'hello'}, a)
            WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

            > db.users.find()
            { "_id" : ObjectId("5c8bbf30d99f878686a2da28"), "username" : "hello", "city" : "beijing" }
            { "_id" : ObjectId("5c8bc116d99f878686a2da29"), "username" : "world" }

        ```
        * 例子（2）
        ```

            > db.users.save({username: "world"})
            WriteResult({ "nInserted" : 1 })


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

    * 修改器
        * $set
            * 例子
            ```
                > db.users.find()
                { "_id" : ObjectId("5c8c85f7529cdc4d1db7f531"), "username" : "world" }
                { "_id" : ObjectId("5c8c8609529cdc4d1db7f532"), "username" : "hello" }

                # 使用$set添加键值
                > db.users.update({username: 'hello'}, {$set: {city: 'beijing'}})
                WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

                > db.users.find()
                { "_id" : ObjectId("5c8c85f7529cdc4d1db7f531"), "username" : "world" }
                { "_id" : ObjectId("5c8c8609529cdc4d1db7f532"), "username" : "hello", "city" : "beijing" }

                # 使用$set修改键值
                > db.users.update({username: 'hello'}, {$set: {city: 'shanghai'}})
                WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

                > db.users.find()
                { "_id" : ObjectId("5c8c85f7529cdc4d1db7f531"), "username" : "world" }
                { "_id" : ObjectId("5c8c8609529cdc4d1db7f532"), "username" : "hello", "city" : "shanghai" }

            ```
        * $unset
            * 例子
            ```
                > db.users.find()
                { "_id" : ObjectId("5c8c85f7529cdc4d1db7f531"), "username" : "world" }
                { "_id" : ObjectId("5c8c8609529cdc4d1db7f532"), "username" : "hello", "city" : "shanghai" }

                # 删除键值
                > db.users.update({username: 'hello'}, {$unset: {city: 'shanghai'}})
                WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

                > db.users.find()
                { "_id" : ObjectId("5c8c85f7529cdc4d1db7f531"), "username" : "world" }
                { "_id" : ObjectId("5c8c8609529cdc4d1db7f532"), "username" : "hello" }


            ```
        * $inc
            * 例子
            ```
                > db.users.find()
                { "_id" : ObjectId("5c8c85f7529cdc4d1db7f531"), "username" : "world" }
                { "_id" : ObjectId("5c8c8609529cdc4d1db7f532"), "username" : "hello", "score" : 10 }

                # score += 10
                > db.users.update({username: 'hello'}, {$inc: {score: 10}})
                WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

                > db.users.find()
                { "_id" : ObjectId("5c8c85f7529cdc4d1db7f531"), "username" : "world" }
                { "_id" : ObjectId("5c8c8609529cdc4d1db7f532"), "username" : "hello", "score" : 20 }


            ```
        * $push
            * 例子
            ```
                > db.users.find()
                { "_id" : ObjectId("5c8c85f7529cdc4d1db7f531"), "username" : "world" }
                { "_id" : ObjectId("5c8c8609529cdc4d1db7f532"), "username" : "hello", "score" : 20 }

                # 原文档里没有数组，则$push会创建一个新数组
                > db.users.update({username: 'hello'}, {$push: {arr: {a:1}}})
                WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

                > db.users.find()
                { "_id" : ObjectId("5c8c85f7529cdc4d1db7f531"), "username" : "world" }
                { "_id" : ObjectId("5c8c8609529cdc4d1db7f532"), "username" : "hello", "score" : 20, "arr" : [ { "a" : 1 } ] }

                # $push操作往数组里push一个新键值
                > db.users.update({username: 'hello'}, {$push: {arr: {b:2}}})
                WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

                > db.users.find()
                { "_id" : ObjectId("5c8c85f7529cdc4d1db7f531"), "username" : "world" }
                { "_id" : ObjectId("5c8c8609529cdc4d1db7f532"), "username" : "hello", "score" : 20, "arr" : [ { "a" : 1 }, { "b" : 2 } ] }

            ```


            
* 删除
    * 例子（1）
        ```
            > db.users.find()
            { "_id" : ObjectId("5c8bbf30d99f878686a2da28"), "username" : "hello", "city" : "beijing" }
            { "_id" : ObjectId("5c8bc116d99f878686a2da29"), "username" : "world" }

            > db.users.remove({username: 'hello'})
            WriteResult({ "nRemoved" : 1 })

            > db.users.find()
            { "_id" : ObjectId("5c8bc116d99f878686a2da29"), "username" : "world" }
            

        ```
    * 例子（2）
        ```
            > db.users.findOne()
            { "_id" : ObjectId("5c8c7e91529cdc4d1db7f530"), "username" : "hello" }

             # 删除整个集合
            > db.users.drop()
            true

            > db.users.findOne()
            null

        ```

#### 索引