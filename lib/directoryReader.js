'use strict';

var Q = require('q'),
    fs = require('fs'),
    util = require('util'),
    path = require('path'),
    log = require('color-log'),
    fileChecker = require('./fileChecker.js');

var isMp3File = function (fileName) {
  return path.extname(fileName) === '.mp3';
};

var filterMp3Files = function (files) {
  return files.filter(isMp3File);
};

var existsDir = function (directoryPath) {
  return fs.existsSync(directoryPath);
};

var init = function (directoryPath, whatIf) {
  if (!existsDir(directoryPath)) {
    return;
  }

  var processedPath = path.join(directoryPath, 'processed');
  if (!existsDir(processedPath)) {
    // log.info(util.format('Directory "%s" was created', processedPath));
    fs.mkdirSync(processedPath);
  }
};

var readDir = function (directoryPath, addFileToQueueCallback) {
  if (!existsDir(directoryPath)) {
    log.warn(util.format('Directory "%s" was not found, it will be ignored', directoryPath));
    return;
  }

  // log.info(util.format('Start readfiles in directory "%s"', directoryPath));

  var fileNames = filterMp3Files(fs.readdirSync(directoryPath));
  log.info(util.format('Found %s mp3-files in %s', fileNames.length, directoryPath));

  fileNames.forEach(function (fileName) {
    var filePath = path.join(directoryPath, fileName);
    addFileToQueueCallback(filePath);
  });
};


module.exports.readDir = readDir;
module.exports.init = init;
module.exports.existsDir = existsDir;
module.exports.isMp3File = isMp3File;

