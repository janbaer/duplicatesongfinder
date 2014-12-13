'use strict';

var fs = require('fs');
var path = require('path');
var redis = require('./lib/redisdb.js');

redis.getAllKeys().then(function (keys) {
  var fileName = path.resolve(path.join('./config', 'mp3keys.json'));

  fs.writeFile(fileName, JSON.stringify(keys), function () {
    console.log('All keys exported to ', fileName);
  });
});


