'use strict';

/* jshint -W030 */

var fs = require('fs-extended'),
    q = require('q'),
    sinon = require('sinon'),
    expect = require('chai').expect;

var FileChecker = require('../lib/fileChecker.js');
var KeyStore = require('../lib/keystore.js');

describe('fileChecker Spec', function () {
  var sandbox,
      keystore = new KeyStore(),
      fileChecker = new FileChecker(keystore);

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  describe('When keystore has key', function () {
    beforeEach(function () {
      sandbox.stub(fs, 'deleteFileSync');
      sandbox.stub(keystore, 'has').returns(true);
    });

    beforeEach(function () {
      fileChecker.checkFile('mysong.mp3');
    });

    it('Should check if songname is in keystore', function () {
      expect(keystore.has.calledOnce).to.equal(true);
    });

    it('Should delete the file', function () {
      expect(fs.deleteFileSync.calledOnce).to.be.true;
    });
  });

  describe('When keystore has not the song stored', function () {
    beforeEach(function () {
      sandbox.stub(keystore, 'has').returns(false);
      sandbox.stub(keystore, 'add');
      sandbox.stub(fs, 'moveSync');
    });

    beforeEach(function () {
      fileChecker.checkFile('mysong.mp3');
    });

    it('Should add the key to the keystore', function () {
      expect(keystore.add.calledOnce).to.equal(true);
    });

    it('Should move the file to the processed directory', function () {
      expect(fs.moveSync.calledOnce).to.equal(true);
    });
  });

  afterEach(function () {
    sandbox.restore();
  });
});
