'use strict';

/* jshint -W030 */

var fs = require('fs');
var Q = require('q');
var sinon = require('sinon');
var expect = require('chai').expect;

var directoryReader = require('../lib/directoryReader.js');
var fileMatcher = require('../lib/fileMatcher.js');

describe('directoryReader Spec', function () {
  describe('When Directory contains some mp3 files', function () {
    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
      sandbox.stub(fileMatcher, 'match').returns(Q.resolve(true));
    });

    it('Should call the fileMatcher for each file', function (done) {
      sandbox.stub(fs, 'readdir').yields(null, ['file1.mp3', 'file2.mp3', 'file3.mp3']);

      directoryReader.readFiles('~/download/mp3')
        .done(function () {
          expect(fileMatcher.match.callCount).to.equal(3);
          done();
        });
    });

    describe('and some files are not mp3 files', function () {
      it('Should just call the files with mp3 files', function (done) {
        sandbox.stub(fs, 'readdir').yields(null, ['file1.txt']);
        directoryReader.readFiles('~/download/mp3')
          .done(function () {
            expect(fileMatcher.match.notCalled).to.be.true;
            done();
          });

      });
    });

    afterEach(function () {
      sandbox.restore();
    });
  });
});
