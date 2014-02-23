'use strict';

var q = require('q'),
    fileMatcher = require('./fileMatcher.js');

module.exports.check = function (fileName, whatIf) {
  var simulateOnly = !whatIf;

  var deferred = q.defer();

  deferred.resolve(false);

  return deferred.promise;
};
