'use strict';

var redis = require('then-redis'),
    Q = require('q');

var connect = function () {
  return redis.createClient({ database: 1 });
};

var exists = function (songName) {
  var q = Q.defer();

  var db = connect();

  db.get(songName).then(function (value) {
    var exists = value !== null;
    if (!exists) {
      db.set(songName, songName).then(q.resolve(exists));
    }
    else {
      q.resolve(exists);
    }
  });

  return q.promise;
};

module.exports.exists = exists;




