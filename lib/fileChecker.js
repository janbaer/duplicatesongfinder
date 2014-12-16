'use strict';

var Q = require('q'),
    util = require('util'),
    path = require('path'),
    log = require('color-log'),
    fs = require('fs-extended');

var fileMatcher = require('./fileMatcher.js'),
    songNameBuilder = require('./songNameBuilder.js');

var FileChecker = function (keystore) {
  this.keystore = keystore;
};

FileChecker.prototype.checkFile = function (filePath, whatIf) {
  var q = Q.defer();

  // log.info('Checking file', filePath);

  var fileName = path.basename(filePath); // Filename without directory

  var processedDirectory = path.join(path.dirname(filePath), 'processed');
  var targetFilePath = path.join(processedDirectory, fileName);
  var songName = songNameBuilder.build(path.basename(fileName, '.mp3'));


  try {
    if (this.keystore.has(songName)) {
      log.info(util.format('Delete song "%s"', songName));
      if (!whatIf) {
        fs.deleteFileSync(filePath);
      }
    } else {
      log.info(util.format('Song "%s" is new, moved to processed folder', songName));
      this.keystore.add(songName);
      if (!whatIf) {
        fs.moveSync(filePath, targetFilePath);
      }
    }
    q.resolve();
  } catch (error) {
    log.error(util.format('Error while processing file "%s": %s', filePath, error));
    if (error.code !== 'ENOENT') {
      q.reject(error);
    }
  }

};

module.exports = FileChecker;
