'use strict';

/* jshint -W030 */

var fs = require('fs'),
    q = require('q'),
    sinon = require('sinon'),
    expect = require('chai').expect;

var directoryReader = require('../lib/directoryReader.js');
var fileChecker = require('../lib/fileChecker.js');

describe('directoryReader Spec', function () {
  var sandbox;
  var readDirCallbackSpy;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    readDirCallbackSpy = sinon.spy();
  });

  describe('readDir', function () {
    beforeEach(function () {
      sandbox.stub(fs, 'existsSync').returns(true);
      sandbox.stub(fs, 'readdirSync').returns(['file1.mp3', 'file2.mp3', 'file3.mp3']);
    });

    beforeEach(function () {
      directoryReader.readDir('~/download/mp3', readDirCallbackSpy);
    });

    it('Should call the callbackfunction for each file', function () {
      expect(readDirCallbackSpy.callCount).to.equal(3);
    });
  });

  describe('and some files are not mp3 files', function () {
    beforeEach(function () {
      sandbox.stub(fs, 'existsSync').returns(true);
      sandbox.stub(fs, 'readdirSync').returns(['file1.mp3', 'file2.txt', 'file3.mp3']);
    });

    beforeEach(function () {
      directoryReader.readDir('~/Downloads/mp3', readDirCallbackSpy);
    });

    it('Should just call the callback just with mp3 files', function () {
      expect(readDirCallbackSpy.callCount).to.equal(2);
    });
  });

  describe('Init', function () {
    var testDirectoryPath = '~/Downloads/mp3',
        processedDirectoryPath = '~/Downloads/mp3/processed';

    describe('When the processed directory not exists', function () {
      beforeEach(function () {
        var fsExistsStub = sandbox.stub(fs, 'existsSync');
        fsExistsStub.withArgs(testDirectoryPath).returns(true);
        fsExistsStub.withArgs(processedDirectoryPath).returns(false);
        sandbox.stub(fs, 'mkdirSync');
      });

      beforeEach(function () {
        directoryReader.init(testDirectoryPath);
      });

      it('Should check if the directories exists', function () {
        expect(fs.existsSync.callCount).to.equal(2);
      });

      it('Should create the processed directory', function () {
        expect(fs.mkdirSync.calledWith(processedDirectoryPath)).to.be.true;
      });
    });

    describe('When the processed directory exists', function () {
      beforeEach(function () {
        sandbox.stub(fs, 'existsSync').returns(true);
        sandbox.stub(fs, 'mkdirSync');
      });

      beforeEach(function () {
        directoryReader.init(testDirectoryPath);
      });

      it('Should not try to create directory', function () {
        expect(fs.mkdirSync.called).to.be.false;
      });
    });
  });

  afterEach(function () {
    sandbox.restore();
  });
});
