describe('keystore spec', function() {
  'use strict';

  var fs = require('fs');
  var sinon = require('sinon');
  var KeyStore = require('../lib/keystore.js');
  var expect = require('chai').expect;

  describe('When load has been called', function () {

    describe('and file exists', function () {
      var keystore;

      beforeEach(function () {
        sinon.stub(fs, 'existsSync').returns(true);
        sinon.stub(fs, 'readFileSync').returns('["Song1", "Song2"]');
        keystore = new KeyStore('some filename');
      });

      beforeEach(function () {
        keystore.load();
      });

      it('Should load the keys from the file', function () {
        expect(keystore.has('Song1')).to.equal(true);
        expect(keystore.has('Song2')).to.equal(true);
      });
    });
  });
});
