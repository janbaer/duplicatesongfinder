'use strict';

var fs = require('fs');
var path = require('path');
var redis = require('./lib/redisdb.js');
var util = require('util');
var log = require('color-log');

redis.getAllKeys().then(function (keys) {
  log.info(util.format('Begin exporting %d keys', keys.length));

  var fileName = path.resolve(path.join('./config', 'mp3keys.json'));

  fs.writeFile(fileName, JSON.stringify(keys), function () {
    log.info('All keys exported to ', fileName);
    process.exit();
  });
});


