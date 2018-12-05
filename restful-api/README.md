#### Restful Api
* rest资源
    * 每个rest资源都有唯一的标识，即uri
* http方法 => rest资源的增删改查
    * GET, 例如：相应uri对应的含义
    ```
        /users      获取用户列表
        /users/abc  获取用户abc的具体信息
    ```
    * POST
    ```
        /users      创建一个新的用户
    ```
    * PUT
    ```
        /users/123  更新id是123的用户
    ```
    * DELETE
    ```
        /users/123  删除id是123的用户
    ```
