#### 如何使用logrotate对日志进行切割
* logrotate介绍<br/>
logrotate是基于crontab运行的，是一个日志管理工具，可以分割日志
* logrotate安装
```
yum install logrotate

$ which logrotate
/usr/sbin/logrotate

```
* 查看logroate相关的配置文件<br/>
```
$ rpm -ql logrotate
/etc/cron.daily/logrotate
/etc/logrotate.conf
/etc/logrotate.d
/usr/sbin/logrotate
/usr/share/doc/logrotate-3.7.8
/usr/share/doc/logrotate-3.7.8/CHANGES
/usr/share/doc/logrotate-3.7.8/COPYING
/usr/share/man/man5/logrotate.conf.5.gz
/usr/share/man/man8/logrotate.8.gz
/var/lib/logrotate.status
```

* logrotate切割配置文件的参数介绍
```
missingok：在日志轮训期间忽略错误，如“日志文件无法找到”的错误。

dateext：切换后的日志文件会附加上一个短横线和YYYYMMDD格式的日期，没有这个配置项会附加一个小数点加一个数字序号。

notifempty：如果日志文件为空，不执行切割。

daily:按天轮训切割日志。

monthly：按月轮训切割日志。

weekly：按周轮训切割日志。

yearly：按年轮训切割日志。

rotate 7：保留最近7天的日志记录

sharedscripts：只为整个日志组运行一次的脚本

postrotate和endscript：里面指定的命令将被执行。

compress:：在轮循任务完成后，已轮循的归档将使用gzip进行压缩。

delaycompress:：总是与compress选项一起用，delaycompress选项指示logrotate不要将最近的归档压缩，压缩将在下一次轮循周期进行。这在你或任何软件仍然需要读取最新归档时很有用。

create 644 www www: 以指定的权限创建全新的日志文件，同时logrotate也会重命名原始日志文件。


```


* 如何配置切割的文件，这里以nginx的日志为例<br/>
    * 在/etc/logrotate.conf文件夹中新建nginx切割配置文件
    ```
    /var/log/nginx/access.log  {
    daily
    rotate 7
    missingok
    notifempty
    dateext
    compress
    delaycompress
    create 600 www www
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
    }

    ```

    * 添加到定时任务crontab
    ```
    # 检查crontab服务是否启动
    service crond status

    logrotate -vf  /etc/logrotate.d/nginx

    crontab  -e  
    # 每天凌晨定时执行脚本
    0 0 * * * logrotate -vf /etc/logrotate.d/nginx  

    # 重新启动crontab服务
    service crond restart

    # 查看当前执行的定时任务
    crontab -l

    ```
    * 添加过程中如果出现错误crond: can't lock /var/run/crond.pid, otherpid may be 2122: Resource temporarily unavailable
    ```
    解决方法：
    sudo rm -rf /var/run/crond.pid 
    sudo crond restart
    ```
