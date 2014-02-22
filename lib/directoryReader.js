'use strict';

var q = require('q'),
    fs = require('fs'),
    fileMatcher = require('./fileMatcher.js');

module.exports.readFiles = function (path, whatIf) {
  var deferred = q.defer();

  fs.readdir(path, function (error, files) {
    files.forEach(function (file) {
      if (fileMatcher.match(file)) {

      }
    });
    deferred.resolve();
  });


  return deferred.promise;
};
