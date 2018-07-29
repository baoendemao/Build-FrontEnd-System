#### 如何编写shell脚本对日志进行切割
* 代码如下：
```
#!/bin/bash
# 日志文件夹
log_path='/var/log/nginx/monitor-logs' 
# 事件戳，如2018-07-28_11-27-58
time=$(date -d yesterday +"%Y-%m-%d_%H-%M-%S" )  
# 今天
today=$(date -d today +"%Y%m%d" ) 
# 日志文件夹，如20180729
today_folder="$log_path/$today"

# 文件夹如果不存在, 则创建
if [ ! -d "$today_folder" ]; then
  mkdir $today_folder
fi

# 文件如果存在，则转存到日期文件夹下
# 文件如果不存在，则创建
if [ -f "$log_path/access.log" ]; then
  sudo mv $log_path/access.log $today_folder/access.log_${time}
else
  sudo touch $log_path/access.log
  sudo chmod 644 $log_path/access.log
fi

sudo kill -USR1 `cat /var/run/nginx.pid` 

```
* 然后将脚本添加到crontab的定时任务中
```
$ crontab -e 
# 设定一个小时执行一次这个任务
0 * * * *  sudo /etc/nginx/conf/nginx-log.sh

$ crontab -l
0 * * * *  sudo /etc/nginx/conf/nginx-log.sh

$ sudo service crond restart
Stopping crond: [  OK  ]
Starting crond: [  OK  ]


```

* 可能遇到的问题<br/>
    * crontab配置好，但是不按时执行
        * 解决方法： 查看/var/spool/mail/root中是否有错误记录，查看/var/log/cron里的日志是否有定时任务的执行记录
    * 报错：you must have a tty to run sudo
        * vim /etc/sudoers , 注释掉 Default requiretty , 来允许sudo在后台允许

