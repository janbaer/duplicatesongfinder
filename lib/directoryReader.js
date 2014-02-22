'use strict';

var q = require('q'),
    fs = require('fs'),
    path = require('path'),
    fileMatcher = require('./fileMatcher.js');

module.exports.readFiles = function (directoryPath, whatIf) {
  var deferred = q.defer();

  fs.readdir(directoryPath, function (error, files) {
    files.forEach(function (file) {
      if (path.extname(file) !== '.mp3') {
        return;
      }

      if (fileMatcher.match(file)) {

      }
    });
    deferred.resolve();
  });


  return deferred.promise;
};
