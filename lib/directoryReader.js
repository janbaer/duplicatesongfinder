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
  return fs.existsSync(directoryPath);
};

var init = function (directoryPath, whatIf) {
  if (existsDir(directoryPath)) {
    var processedPath = path.join(directoryPath, 'processed');
    if (!existsDir(processedPath)) {
      log.info(util.format('Directory "%s" was created', processedPath));
      fs.mkdirSync(processedPath);
    }
  }
};

var readDir = function (directoryPath, addFileToQueueCallback) {
  if (existsDir(directoryPath)) {
    log.info(util.format('Start readfiles in directory "%s"', directoryPath));

    var files = filterMp3Files(fs.readdirSync(directoryPath));
    log.info(util.format('Found %s mp3-files in %s', files.length, directoryPath));
    files.forEach(function (file) {
      addFileToQueueCallback(path.join(directoryPath, file));
    });

  } else {
    log.warn(util.format('Directory "%s" was not found, it will be ignored', directoryPath));
  }
};


module.exports.readDir = readDir;
module.exports.init = init;
module.exports.existsDir = existsDir;

