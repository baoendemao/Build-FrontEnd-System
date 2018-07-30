#### 如何编写shell脚本对日志进行切割
* 代码如下：
```
#!/bin/bash
# 日志文件夹
log_path='/var/log/nginx/monitor-logs' 
# 事件戳，如2018-07-28_11-27-58
time=$(date -d today +"%Y-%m-%d_%H-%M-%S" )  
# 今天
today=$(date -d today +"%Y%m%d" ) 
# 日志文件夹，如20180729
today_folder="$log_path/$today"

# 文件夹如果不存在, 则创建
if [ ! -d "$today_folder" ]; then
  mkdir $today_folder
fi

# 将access.log转存到日期文件夹下
if [ ! -f "$today_folder/access.log_${time}" ]; then
  cat $base_path/access.log > $today_folder/access.log_${time}
  cat /dev/null > $base_path/access.log
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


