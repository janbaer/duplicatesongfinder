'use strict';

var Q = require('q'),
    fs = require('fs'),
    pathUtil = require('path'),
    fileChecker = require('./fileChecker.js');

var read = function (path, whatIf) {
  var q = Q.defer();

  console.log('Start readfiles in directory "%s"', path);

  fs.readdir(path, function (error, files) {
    if (error) {
      console.error('Error while reading all files from directory "%s": %s', path, error);
      q.reject(error);
      return;
    }

    console.log('Directory "%s" contains %s files', path, files.length);

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
      fs.mkdir(processedPath, function (error) {
        if (error) {
          console.error('Error while creating directory "%s": %s', processedPath, error);
          q.reject(error);
        } else {
          console.info('Directory "%s" was created', processedPath);
          q.resolve();
        }
      });
    } else {
      q.resolve();
    }
  });

  return q.promise;
};

module.exports.read = read;
module.exports.init = init;

