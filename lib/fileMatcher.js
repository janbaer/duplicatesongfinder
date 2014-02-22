'use strict';

var q = require('q');

module.exports.match = function (fileName) {
  var deferred = q.defer();

  deferred.resolve(false);

  return deferred.promise;
};
