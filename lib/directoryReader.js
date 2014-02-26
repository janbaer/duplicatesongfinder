'use strict';

var Q = require('q'),
    fs = require('fs'),
    pathUtil = require('path'),
    fileChecker = require('./fileChecker.js');

var read = function (path, whatIf) {
  var q = Q.defer();

  fs.readdir(path, function (error, files) {
    files.forEach(function (file) {
      if (pathUtil.extname(file) !== '.mp3') {
        return;
      }
      fileChecker.check(file, whatIf);
    });
    q.resolve();
  });

  return q.promise;
};

var init = function (path, whatIf) {
  var q = Q.defer();

  var processedPath = pathUtil.join(path, 'processed');

  fs.exists(processedPath, function (exists) {
    if (!exists) {
      fs.mkdir(processedPath, function (err) {
        console.info('Create directory %s', processedPath);
        if (err) {
          q.reject(err);
        } else {
          q.resolve();
        }
      });
    }
    q.resolve();
  });

  return q.promise;
};

module.exports.read = read;
module.exports.init = init;

