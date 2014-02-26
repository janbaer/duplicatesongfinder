'use strict';

var Q = require('q'),
    mv = require('mv');

var fileMatcher = require('./fileMatcher.js');

module.exports.check = function (fileName, whatIf) {
  var simulateOnly = !whatIf;

  var q = Q.defer();

  fileMatcher.match(fileName)
    .then(function (isMatched) {
      if (isMatched) {

      } else {

      }
    })
    .done();

  q.resolve(false);

  return q.promise;
};
