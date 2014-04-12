'use strict';

var Q = require('q'),
    fs = require('fs'),
    util = require('util'),
    path = require('path'),
    log = require('color-log'),
    fileChecker = require('./fileChecker.js');

var filterMp3Files = function (files) {
  return files.filter(function (file) {
    return path.extname(file) === '.mp3';
  });
};

var existsDir = function (directoryPath) {
  var q = Q.defer();

  fs.exists(directoryPath, function (exists) {
    q.resolve(exists);
  });

  return q.promise;
};

var readFiles = function (directoryPath, files, whatIf) {
  var q = Q.defer();
  var promises = [];


  if (files.length > 0) {
    log.info(util.format('Checking "%s" files from directory %s', files.length, directoryPath));

    files.forEach(function (file) {
      promises.push(fileChecker.check(path.join(directoryPath, file), whatIf));
    });

    Q.all(promises).done(q.resolve);
  } else {
    q.resolve();
  }

  return q.promise;
};

var readDir = function (directoryPath, whatIf) {
  var q = Q.defer();


  existsDir(directoryPath).then(function (exists) {
    if (exists) {
      log.info(util.format('Start readfiles in directory "%s"', directoryPath));

      fs.readdir(directoryPath, function (error, files) {
        if (error) {
          log.error(util.format('Error while reading all files from directory "%s": %s', directoryPath, error));
          q.reject(error);
          return;
        }

        readFiles(directoryPath, filterMp3Files(files), whatIf)
          .then(q.resolve)
          .catch(function (error) {
            q.reject(error);
          });
      });
    } else {
      log.warn(util.format('Directory "%s" was not found, it will be ignored', directoryPath));
      q.resolve();
    }
  });

  return q.promise;
};

var init = function (directoryPath, whatIf) {
  var q = Q.defer();

  existsDir(directoryPath).then(function (exists) {
    if (exists) {
      var processedPath = path.join(directoryPath, 'processed');

      existsDir(processedPath).then(function (exists) {
        if (exists === false) {
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
    } else {
      q.resolve();
    }
  });

  return q.promise;
};

module.exports.readDir = readDir;
module.exports.readFiles = readFiles;
module.exports.init = init;
module.exports.existsDir = existsDir;

