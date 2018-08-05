var cluster = require('cluster');
var http = require('http');

// 获取cpu的数量
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // master进程
    console.log('[master] ' + "start master...");

    // 根据cpu的数量，fork出来work进程
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('listening',function(worker,address){
        console.log('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    console.log('[worker] ' + "start worker ..." + cluster.worker.id);

    http.createServer(function(req, res) {
        console.log('worker'+cluster.worker.id);
        res.end('worker'+cluster.worker.id+',PID:'+process.pid);
    }).listen(3000);
}
