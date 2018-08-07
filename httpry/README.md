#### 在linux下使用httpry抓包

```
// 安装
yum install httpry

// 启动httpry监控端口号是12800的请求，并将请求的数据记录在binary_file的文件里
sudo httpry -i eth0 -m get,head  "tcp  port  12800" -b binary_file

// 使用参数
$ httpry -h
httpry version 0.1.8 -- HTTP logging and information retrieval tool
Copyright (c) 2005-2014 Jason Bittel <jason.bittel@gmail.com>
Usage: httpry [ -dFhpqs ] [-b file ] [ -f format ] [ -i device ] [ -l threshold ]
              [ -m methods ] [ -n count ] [ -o file ] [ -P file ] [ -r file ]
              [ -t seconds] [ -u user ] [ 'expression' ]

   -b file      write HTTP packets to a binary dump file
   -d           run as daemon
   -f format    specify output format string
   -F           force output flush
   -h           print this help information
   -i device    listen on this interface
   -l threshold specify a rps threshold for rate statistics
   -m methods   specify request methods to parse
   -n count     set number of HTTP packets to parse
   -o file      write output to a file
   -p           disable promiscuous mode
   -P file      use custom PID filename when running in daemon mode
   -q           suppress non-critical output
   -r file      read packets from input file
   -s           run in HTTP requests per second mode
   -t seconds   specify the display interval for rate statistics
   -u user      set process owner
   expression   specify a bpf-style capture filter

Additional information can be found at:
   http://dumpsterventures.com/jason/httpry


```
具体使用见官方GitHub： https://github.com/jbittel/httpry