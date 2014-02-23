'use strict';

/* jshint -W030 */

var fs = require('fs'),
    q = require('q'),
    sinon = require('sinon'),
    expect = require('chai').expect;

var fileChecker = require('../lib/fileChecker.js');
var fileMatcher = require('../lib/fileMatcher.js');

describe('fileChecker Spec', function () {
  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sandbox.stub(fs, 'unlinkSync');
  });

  describe('When fileMatcher returns true', function () {
    it('Should delete the file', function () {
      sinon.stub(fileMatcher, 'match').returns(true);
    });
  });

  describe('When fileMatcher returns false', function () {
    it('Should move the file to the processed directory', function () {

    });
  });

  afterEach(function () {
    sandbox.restore();
  });
});
