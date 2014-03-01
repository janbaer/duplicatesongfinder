'use strict';

var Q = require('q'),
    fs = require('fs'),
    util = require('util'),
    path = require('path'),
    log = require('color-log'),
    fileChecker = require('./fileChecker.js');

var read = function (directoryPath, whatIf) {
  var q = Q.defer();

  log.info(util.format('Start readfiles in directory "%s"', directoryPath));

  fs.readdir(directoryPath, function (error, files) {
    if (error) {
      log.error(util.format('Error while reading all files from directory "%s": %s', directoryPath, error));
      q.reject(error);
      return;
    }

    log.info(util.format('Directory "%s" contains %s files', directoryPath, files.length));

    files.forEach(function (file) {
      if (path.extname(file) !== '.mp3') {
        return;
      }
      fileChecker.check(file, whatIf);
    });

    q.resolve();
  });

  return q.promise;
};

var init = function (directoryPath, whatIf) {
  var q = Q.defer();

  var processedPath = path.join(directoryPath, 'processed');

  fs.exists(processedPath, function (exists) {
    if (!exists) {
      fs.mkdir(processedPath, function (error) {
        if (error) {
          log.error(util.format('Error while creating directory "%s": %s', processedPath, error));
          q.reject(error);
        } else {
          log.info(util.format('Directory "%s" was created', processedPath));
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

