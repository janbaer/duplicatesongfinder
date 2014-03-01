'use strict';

var q = require('q');
var db = require('./redisdb.js');

module.exports.match = function (fileName) {
  return db.exists(fileName);
};
