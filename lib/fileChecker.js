'use strict';

var Q = require('q'),
    util = require('util'),
    path = require('path'),
    log = require('color-log'),
    fs = require('fs-extended');

var fileMatcher = require('./fileMatcher.js');

module.exports.check = function (filePath, whatIf) {
  var fileName = path.basename(filePath, '.mp3');
  var targetFilePath = path.join(path.dirname(filePath), 'processed', fileName);
  var q = Q.defer();

  //log.info(util.format('Checking file "%s"', filePath));

  fileMatcher.match(filePath)
    .then(function (isMatched) {
      try {
        if (isMatched) {
          log.info(util.format('Delete file "%sd"', fileName));
          if (!whatIf) {
            fs.deleteFileSync(filePath);
          }
        } else {
          log.info(util.format('File "%s" is new, moved to processed folder', fileName));
          if (!whatIf) {
            fs.moveSync(filePath, targetFilePath);
          }
        }
        q.resolve();
      } catch (err) {
        if (err.code !== 'ENOENT') {
          q.reject(err);
        }
      }
    })
    .done();

  return q.promise;
};
