#### 目录
* 文章简介
* 安装node环境
* 安装npm环境
* 安装pm2环境
* 搭建git server
* 搭建持续集成环境jenkins
* 新建前端工程
* 搭建npm私有源
* 部署脚本
* 执行脚本

#### 文章简介
* 本文将jenkins的持续集成过程分成了两步：第一步(即部署过程)包括从git clone项目，然后build项目，打包后上传到私有npm； 第二步(即执行过程)包括从私有npm上将项目包install下来到项目工程目录，
pm2启动node进程。
* 本文主要介绍了具体的前端工程的搭建，如node、npm、pm2、jenkins的安装过程，如何搭建git server、如何使用淘宝的cnpm搭建自己的私有npm环境，
以及自执行的shell部署脚本和shell执行脚本。

#### 安装node环境 
* yum install -g nodejs 或者 wget node的压缩包
```
[root@iZ8vb5awc622gw7a274vsbZ ~]# node -v
v6.9.1
```
#### 安装npm环境
* yum install -g npm 或者 wget npm的压缩包
```
[root@iZ8vb5awc622gw7a274vsbZ ~]# npm -v
3.10.8
```
#### 安装pm2环境
* pm2简介
    * pm2是node的进程管理器，使用pm2启动node进程，保持在后台永久运行。
    * pm2的优势
        * 内建负载均衡
        * 后台运行
        * 0秒停机重载
        * 停止不稳定的进程，避免无线循环
        * 控制台检测
        * 提供HTTP API
        * 远程控制和实时的接口API
*  安装
```
$ npm install -g pm2
```
* 测试pm2
```
[root@iZ8vb5awc622gw7a274vsbZ wangli-workspace]# cat test.js
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end('Hello World\n'); 
}).listen(1337, "127.0.0.1"); 
console.log('Server running at http://127.0.0.1:1337/');

[root@iZ8vb5awc622gw7a274vsbZ wangli-workspace]# pm2 start test.js --name 'testjs'
[PM2] Starting /var/tmp/wangli-workspace/test.js in fork_mode (1 instance)
[PM2] Done.
┌────────┬──────┬────────┬───┬─────┬───────────┐
│ Name   │ mode │ status │ ↺ │ cpu │ memory    │
├────────┼──────┼────────┼───┼─────┼───────────┤
│ testjs │ fork │ online │ 0 │ 42% │ 17.3 MB   │
└────────┴──────┴────────┴───┴─────┴───────────┘
 Use `pm2 show <id|name>` to get more details about an app
 
[root@iZ8vb5awc622gw7a274vsbZ wangli-workspace]# pm2 monit
```

#### 搭建git server
* 新建git用户
```
[root@iZ8vb5awc622gw7a274vsbZ test.wangli.com]# adduser git

[root@iZ8vb5awc622gw7a274vsbZ test-project.git]# passwd git

[root@iZ8vb5awc622gw7a274vsbZ test.wangli.com]# tail -1 /etc/passwd
git:x:500:500::/home/git:/bin/bash
```
* 初始化git裸仓库
    * 裸仓库没有工作区，因为服务器上的Git仓库纯粹是为了共享，所以不让用户直接登录到服务器上去改工作区，服务器上的Git仓库通常都以.git结尾
```
[root@iZ8vb5awc622gw7a274vsbZ wangli-workspace]# git clone --bare test-project test-project.git
Initialized empty Git repository in /var/tmp/wangli-workspace/test-project.git/
warning: You appear to have cloned an empty repository.
```

* 将owner改为git
```
[root@iZ8vb5awc622gw7a274vsbZ wangli-workspace]# chown -R git:git test-project.git/
```
* 不允许git用户登录shell
    * 出于安全考虑，新创建的git用户是不允许登录shell的，这可以通过编辑/etc/passwd文件完成。找到类似下面的一行：
```
git:x:500:500::/home/git:/bin/shell 修改成
git:x:500:500::/home/git:/usr/bin/git-shell
```
```
[wangli@iZ8vb5awc622gw7a274vsbZ ~]$ tail -2 /etc/passwd
git:x:500:500::/home/git:/usr/bin/git-shell
wangli:x:501:501::/home/wangli:/bin/bash
```
```
[root@iZ8vb5awc622gw7a274vsbZ test-project.git]# su - git
fatal: What do you think I am? A shell?
```
* 在本地clone项目
```
wl@wangli: ~/front-end/test $ git clone git@47.92.64.91:/var/tmp/wangli-workspace/test-project.git
wl@wangli: ~/front-end/test $ ls
test-project
```
* 在本地测试git服务器是否可用
    * 在本地添加文件commit push，裸仓库中看不到提交的文件，原因是在裸仓库的hooks文件夹里需要添加post-receive文件指向创建的工程
```
[root@iZ8vb5awc622gw7a274vsbZ hooks]# chown git:git post-receive

[root@iZ8vb5awc622gw7a274vsbZ hooks]# chmod +x post-receive

[root@iZ8vb5awc622gw7a274vsbZ test-project.git]# cat hooks/post-receive
#!/bin/sh
GIT_WORK_TREE=/var/tmp/wangli-workspace/www git checkout -f
```

```
# 修改后，本地创建新文件，add commit push后，可以在服务器看到相应文件
[root@iZ8vb5awc622gw7a274vsbZ test-project.git]# ls /var/tmp/wangli-workspace/www/
README  test2.js
```

#### 搭建持续集成环境jenkins
* jenkins简介
    * jenkins是一款能提高工作效率的软件，能够帮助我们把软件开发过程形成工作流。
    * 典型的工作流包括：
        * 开发
        * 提交
        * 编译
        * 测试
        * 发布
* 准备jdk环境
```
[root@iZ8vb5awc622gw7a274vsbZ wangli-workspace]# java -version
java version "1.8.0_121"
Java(TM) SE Runtime Environment (build 1.8.0_121-b13)
Java HotSpot(TM) 64-Bit Server VM (build 25.121-b13, mixed mode)

[root@iZ8vb5awc622gw7a274vsbZ wangli-workspace]# javac
用法: javac <options> <source files>
其中, 可能的选项包括:
  -g                         生成所有调试信息
  -g:none                    不生成任何调试信息
 ```
* 准备tomcat环境
```
[root@iZ8vb5awc622gw7a274vsbZ apache-tomcat-6.0.51]# bin/startup.sh 
Using CATALINA_BASE:   /usr/tomcat/apache-tomcat-6.0.51
Using CATALINA_HOME:   /usr/tomcat/apache-tomcat-6.0.51
Using CATALINA_TMPDIR: /usr/tomcat/apache-tomcat-6.0.51/temp
Using JRE_HOME:        /usr/java/jdk1.8.0_121
Using CLASSPATH:       /usr/tomcat/apache-tomcat-6.0.51/bin/bootstrap.jar

[root@iZ8vb5awc622gw7a274vsbZ apache-tomcat-6.0.51]# tail -f logs/catalina.out 
信息: Server startup in 5399 ms

[root@iZ8vb5awc622gw7a274vsbZ apache-tomcat-6.0.51]# ps -ef | grep java
root     10066     1 12 22:49 pts/0    00:00:07 /usr/java/jdk1.8.0_121/bin/java -Djava.util.logging.config.file=/usr/tomcat/apache-tomcat-6.0.51/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Djdk.tls.ephemeralDHKeySize=2048 -Djava.endorsed.dirs=/usr/tomcat/apache-tomcat-6.0.51/endorsed -classpath /usr/tomcat/apache-tomcat-6.0.51/bin/bootstrap.jar -Dcatalina.base=/usr/tomcat/apache-tomcat-6.0.51 -Dcatalina.home=/usr/tomcat/apache-tomcat-6.0.51 -Djava.io.tmpdir=/usr/tomcat/apache-tomcat-6.0.51/temp org.apache.catalina.startup.Bootstrap start
root     10151  9364  0 22:50 pts/0    00:00:00 grep java
```
*  安装jenkins
```
[root@iZ8vb5awc622gw7a274vsbZ jenkins]# scp jenkins.war  ../tomcat/apache-tomcat-6.0.51/webapps/

[root@iZ8vb5awc622gw7a274vsbZ apache-tomcat-6.0.51]# bin/startup.sh 

# jenkins 初始密码地址：
[root@iZ8vb5awc622gw7a274vsbZ jenkins]# vim ~/.jenkins/secrets/initialAdminPassword 
```

*  jenkins中新建Item
    *  新建任务
    *  通过ssh的方式，添加git服务器路径。
    *  设置admin用户ssh git@127.0.0.1无密码：
        ```
            [admin@iZ8vb5awc622gw7a274vsbZ ~]$ ssh-keygen
            
            [root@iZ8vb5awc622gw7a274vsbZ git]# cat /home/admin/.ssh/id_rsa.pub  >> /home/git/.ssh/authorized_keys 
            
            [git@iZ8vb5awc622gw7a274vsbZ .ssh]$ chmod 600 authorized_keys 
            
            [admin@iZ8vb5awc622gw7a274vsbZ ~]$ ssh git@127.0.0.1
            Last login: Tue Nov 21 22:59:58 2017 from 127.0.0.1
        ```
    * 点击jenkins开始构建
        * 从jenkins的本次构建log中确保本次构建可从git server成功clone项目
        ```
        [root@iZ8vb5awc622gw7a274vsbZ ~]# ls ~/.jenkins/workspace/test.wangli.com
        default  default@tmp  README  test2.js
        ```
* 修改JENKINS_HOME
    * 因为jenkins默认安装到用户的home目录，可以根据需要修改到其他路径
    ```
    [root@iZ8vb5awc622gw7a274vsbZ jenkins-workspace]# vim /etc/profile
    添加： export JENKINS_HOME='/var/tmp/jenkins-workspace'
    
    [root@iZ8vb5awc622gw7a274vsbZ jenkins-workspace]# source /etc/profile
    
    [root@iZ8vb5awc622gw7a274vsbZ bin]# echo $JENKINS_HOME
    /var/tmp/jenkins-workspace
    ```

####   新建前端工程
* 本地clone   
    ```
    $ git clone  git@47.92.64.91:/var/tmp/wangli-workspace/test-project.git
    ```
* 搭建好前端测试工程，push到git server

#### 搭建npm私有源
*  安装nrm
```
[root@iZ8vb5awc622gw7a274vsbZ ~]# npm install -g nrm

[root@iZ8vb5awc622gw7a274vsbZ ~]# nrm  ls
* npm ---- https://registry.npmjs.org/
  cnpm --- http://r.cnpmjs.org/
  taobao - https://registry.npm.taobao.org/
  nj ----- https://registry.nodejitsu.com/
  rednpm - http://registry.mirror.cqupt.edu.cn/
  npmMirror  https://skimdb.npmjs.com/registry/
  edunpm - http://registry.enpmjs.org/
  
[root@iZ8vb5awc622gw7a274vsbZ ~]# nrm test npm

* npm ---- 3412ms

[root@iZ8vb5awc622gw7a274vsbZ ~]# nrm test cnpm

  cnpm --- 603ms

[root@iZ8vb5awc622gw7a274vsbZ ~]# nrm test taobao

  taobao - 214ms
```

* 配置私有npm 
    * 简介
        * 这里使用的是淘宝的cnpm, 可以从github上面clone安装。
    * 启动MySQL数据库
        * cnpm依赖数据库，这里选择的是mysql。安装完mysql之后需要启动服务，新建cnpmjs数据库，并导入cnpm安装包里的db.sql文件，创建依赖表。
    ```
    -bash-4.1$ service mysqld start
    -bash-4.1$ mysql -u root -p
    mysql> create database cnpmjs;
    mysql> show databases;
    mysql> source /usr/cnpm/cnpmjs.org/docs/db.sql;
    ```
    * 自定义cnpm配置文件 config/index.js
    
        * 配置1

        *  配置2
            * 7001表示npm源的端口号，7002表示web服务的端口号，bindingHost修改成自己的ip地址
        ```
            registryPort: 7001,
            webPort: 7002,
            bindingHost: '47.92.64.91', 
        ```
        * 启动服务：
        ```
        [root@iZ8vb5awc622gw7a274vsbZ cnpmjs.org]# node dispatch.js   
        ```
        * 配置3
            * 为了方便命令行的操作，可以在~/.bashrc里添加命令别名：
            ```
            mynpm：
            alias mynpm='cnpm --registry=http://47.92.64.91:7001 --cache=$HOME/.npm/.cache/mynpm --userconfig=/root/.mynpmrc'
            ```
        * 配置4
            * npm的config/index.js里改成自己的用户服务，
            集成个性的定制化的用户服务mynpm adduser添加用户
            ```
            git clone  https://github.com/cnpm/npm-user-service
            var NpmUserService = require('./user-service/npm-user-service');
            var myUserService = new NpmUserService();
            ```
            修改字段：
            ```
             userService: myUserService,
            ```

    * 添加npm用户 
    ```
    cd  /var/tmp/jenkins-workspace/workspace/test-npm/test-dir/test-dir
    mynpm login ---scope=@test-company --always-auth
    mynpm install @test-company/test-npm  --save --no-cache
    mynpm cache clear --force
    mynpm adduser --scope=@test-company --always-auth
    
    [root@iZ8vb5awc622gw7a274vsbZ test-npm]# mynpm adduser 
    Username: admin
    Password: 
    Email: (this IS public) 312400021@qq.com
    Logged in as admin on http://47.92.64.91:7001/.
    
    [root@iZ8vb5awc622gw7a274vsbZ test-npm]# mynpm login
    Username: (admin) 
    Password: (<default hidden>) 
    Email: (this IS public) (312400021@qq.com) 
    Logged in as admin on http://47.92.64.91:7001/.
    ```
    * publish工程Build好的包到搭建的npm
    ```
    [root@iZ8vb5awc622gw7a274vsbZ test-npm]# mynpm publish
    + @test-company/test-npm@1.0.0
    
    ```
    * 从搭建的npm中install package
    ```
    [root@iZ8vb5awc622gw7a274vsbZ test-dir]# mynpm install @test-company/test-npm
    npm notice created a lockfile as package-lock.json. You should commit this file.
    npm WARN test-dir@1.0.0 No description
    npm WARN test-dir@1.0.0 No repository field.
    
    + @test-company/test-npm@1.0.2
    added 1 package in 2.519s
    ```
    * 测试新搭建的npm源的响应时间
    ```
    [root@iZ8vb5awc622gw7a274vsbZ ~]# nrm add mynpm http://47.92.64.91:7001
    
        add registry mynpm success
    
    [root@iZ8vb5awc622gw7a274vsbZ ~]# nrm ls
    
    * npm ---- https://registry.npmjs.org/
      cnpm --- http://r.cnpmjs.org/
      taobao - https://registry.npm.taobao.org/
      nj ----- https://registry.nodejitsu.com/
      rednpm - http://registry.mirror.cqupt.edu.cn/
      npmMirror  https://skimdb.npmjs.com/registry/
      edunpm - http://registry.enpmjs.org/
      mynpm -- http://47.92.64.91:7001/
      
    # 明显看到新建的npm源的速度是最高的
    [root@iZ8vb5awc622gw7a274vsbZ ~]# nrm test mynpm
    
      mynpm -- 43ms
    
    [root@iZ8vb5awc622gw7a274vsbZ ~]# nrm test npm
    
    * npm ---- 917ms
    
    [root@iZ8vb5awc622gw7a274vsbZ ~]# nrm test cnpm
    
      cnpm --- 297ms
    ```

#### 部署脚本
* 部署脚本写好后，放在jenkins新建shell执行过程中。主要工作：build项目，打包后上传到私有npm
    ```
    root@iZ8vb5awc622gw7a274vsbZ:/var/tmp/jenkins-workspace/workspace# cat deploy.sh
    #set -x
    typeset packagePath='/var/tmp/jenkins-workspace/workspace/npm-workspace/'
    typeset projectPath='/var/tmp/jenkins-workspace/workspace/test.wangli.com'
    
    export PATH=/usr/local/bin:$PATH
    rm -rf $packagePath'project.tar.gz'
    cd $projectPath
    npm run build
    tar -czf $packagePath'project.tar.gz'  ./* --exclude ./node_modules
    
    cd $packagePath
    typeset old=$(cat package.json | awk -F'"' /version/'{print $4}')
    typeset new=$(echo $old | awk -F'.' '{v=$3;v=v+1;print $1"."$2"."v}')
    sed -i "/version/s/$old/$new/" package.json
    
    echo "The old version in package.json is $old"
    echo "The new version in package.json is $new"
    
    cnpm --registry=http://47.92.64.91:7001 --cache=$HOME/.npm/.cache/mynpm --userconfig=/root/.mynpmrc   publish

    ```


#### 执行脚本
* 执行脚本写好后，放在jenkins新建shell执行过程中。主要工作：从私有npm上将项目包install下来到项目工程目录，pm2启动node进程。
    ```
    root@iZ8vb5awc622gw7a274vsbZ:/var/tmp/jenkins-workspace/workspace# cat execute.sh
    #set -x
    typeset path='/var/tmp/jenkins-workspace/workspace/deploy-workspace'
    typeset deployPath=$path'/project'
    typeset downloadPath=$path'/mynpm-download'
    typeset packagePath=$downloadPath'/node_modules/@test-company/test.wangli.com/project.tar.gz'
    
    export PATH=/usr/local/bin:$PATH
    
    rm -rf `ls $deployPath | grep -v node_modules`
    rm -rf `ls $downloadPath | grep -v package*`
    cd $downloadPath
    cnpm --registry=http://47.92.64.91:7001 --cache=$HOME/.npm/.cache/mynpm --userconfig=/root/.mynpmrc install @test-company/test.wangli.com@latest
    tar -zvxf $packagePath -C $deployPath >/dev/null
    
    pm2 status | awk '/online/{print $2}' | grep server
    if [[ $? == 0 ]];then
      pm2 reload server
    else
      pm2 start $deployPath'/server.js'
    fi
    pm2 list

    ```





