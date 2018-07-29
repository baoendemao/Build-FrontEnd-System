#### 如何使用crontab创建定时任务
* 常用命令
    * 编辑定时任务： crontab -e 
    * 列出定时任务： crontab -l 
        * root查看自己的cron设置： crontab –u root –l 
    * 删除定时任务：crontab –u fred –r
    * 重启服务： service crond restart  
    * 查看服务状态：service crond status
    * 启动服务： service crond start

* 定时任务中每一行记录是由6个字段组成，不同字段间用空格或tab键分隔, 这6个字段分别为：<br/>
   * 分钟（0-59） 
   * 小时（0-23）
   * 日期（1-31） 
   * 月份（1-12）
   * 星期几（0-6，其中0代表星期日，好像7也代表星期日）
   * 第6个字段是一个要在适当时间执行的字符串
* 设定的定时时间示例：
```
    每分钟执行    * * * * *
    每五分钟执行  */5 * * * *
    每小时执行    0 * * * *
    每天执行      0 0 * * *
    每周执行      0 0 * * 0
    每月执行      0 0 1 * *
    每年执行      0 0 1 1 *
```
* crontab相关文件
    * /var/log/cron
    * /etc/cron.deny     
        * 该文件中所列用户不允许使用crontab命令
    * /etc/cron.allow    
        * 该文件中所列用户允许使用crontab命令
    * /var/spool/cron/   
        * 所有用户crontab文件存放的目录,以用户名命名

* 可能遇到的问题<br/>
    * crontab配置好，但是不按时执行
        * 解决方法： 查看/var/spool/mail/root中是否有错误记录，查看/var/log/cron里的日志是否有定时任务的执行记录
    * 报错：you must have a tty to run sudo
        * 解决方法：vim /etc/sudoers , 注释掉 Default requiretty , 来允许sudo在后台允许
