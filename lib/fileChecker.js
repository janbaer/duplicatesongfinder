'use strict';

var Q = require('q'),
    util = require('util'),
    path = require('path'),
    log = require('color-log'),
    fs = require('fs-extended');

var fileMatcher = require('./fileMatcher.js'),
    songNameBuilder = require('./songNameBuilder.js');

module.exports.check = function (filePath, whatIf) {
  var fileName = path.basename(filePath);
  var targetFilePath = path.join(path.dirname(filePath), 'processed', fileName);
  var q = Q.defer();

  var songName = songNameBuilder.build(path.basename(fileName, '.mp3'));

  fileMatcher.match(songName)
    .then(function (isMatched) {
      try {
        if (isMatched) {
          log.info(util.format('Delete song "%s"', songName));
          if (!whatIf) {
            fs.deleteFileSync(filePath);
          }
        } else {
          log.info(util.format('Song "%s" is new, moved to processed folder', songName));
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
    })
    .done();

  return q.promise;
};
