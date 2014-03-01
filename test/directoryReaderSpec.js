'use strict';

/* jshint -W030 */

var fs = require('fs'),
    q = require('q'),
    sinon = require('sinon'),
    expect = require('chai').expect;

var directoryReader = require('../lib/directoryReader.js');
var fileChecker = require('../lib/fileChecker.js');

describe('directoryReader Spec', function () {
  describe('When Directory contains some mp3 files', function () {
    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
    });

    describe('readDir', function () {
      beforeEach(function () {
        sandbox.stub(fileChecker, 'check').returns(q.resolve(true));
      });

      it('Should call the fileChecker for each file', function (done) {
        sandbox.stub(fs, 'readdir').yields(null, ['file1.mp3', 'file2.mp3', 'file3.mp3']);

        directoryReader.readDir('~/download/mp3')
          .done(function () {
            expect(fileChecker.check.callCount).to.equal(3);
            done();
          });
      });

      describe('and some files are not mp3 files', function () {
        beforeEach(function () {
          sandbox.stub(fs, 'readdir').yields(null, ['file1.txt']);
        });

        it('Should just call the files with mp3 files', function (done) {
          directoryReader.readDir('~/Downloads/mp3')
            .done(function () {
              expect(fileChecker.check.notCalled).to.be.true;
              done();
            });
        });
      });
    });

    describe('Init', function () {
      describe('When the processed directory not exists', function () {
        beforeEach(function () {
          sandbox.stub(fs, 'exists').yields(false);
          sandbox.stub(fs, 'mkdir').yields(null);
        });

        it('Should create it', function (done) {
          directoryReader.init('~/Downloads/mp3')
            .done(function () {
              expect(fs.exists.called).to.be.true;
              expect(fs.mkdir.calledWith('~/Downloads/mp3/processed')).to.be.true;
              done();
            });
        });
      });

      describe('When the processed directory exists', function () {
        beforeEach(function () {
          sandbox.stub(fs, 'exists').yields(true);
          sandbox.stub(fs, 'mkdir').yields(null);
        });

        it('Should not try to create directory', function (done) {
          directoryReader.init('~/Downloads/mp3')
            .done(function () {
              expect(fs.exists.called).to.be.true;
              expect(fs.mkdir.called).to.be.false;
              done();
            });
        });
      });
    });

    afterEach(function () {
      sandbox.restore();
    });
  });
});
