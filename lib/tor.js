var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    util = require('util'),
    download = require('./download');
var run, save, failure, next,sa;    
function next() {
    setImmediate(run);
}
function run(infoHash){
    var urls=util.format('http://torcache.net/torrent/%s.torrent', infoHash);
    list.push(urls);
    if(!sa){
        sa=true;
        async.whilst(function () {
            return list.length > 0;
        }, function (callback) {
            var url = list.pop(),
                timer = null;
    
            // 下载3分钟，返回失败
            timer = setTimeout(function () {
                callback(null);
            }, 3 * 60 * 1000);
    
            download(url, function (err, data) {
                clearTimeout(timer);
                if (err) {
                    // 下载失败，但是这里要响应为'成功'，以进入下一个地址的下载
                    callback(null);
                } else {
                    save(_infohash, data);
                    callback('success');
                }
            });
        }, function (err) {
            // err存在，主动断开，表示下载成功
            // if (!err) {
            //     // 下载失败，记录下来
            //     failure(_infohash);
            // }
            console.log('err err');
            next();
        });
    }
    
}
function save(_infohash, data) {
    var filePath = path.join(__dirname + '/../.temp/' + _infohash + '.torrent');
    fs.writeFile(filePath, data, function (err) {
        if (err) {
            logger.error(err);
        }
    });
};
module.exports=run;