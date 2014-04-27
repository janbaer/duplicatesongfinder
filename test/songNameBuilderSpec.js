'use strict';

var builder = require('../lib/songNameBuilder.js'),
    expect = require('chai').expect;

describe('songNameBuilderSpec', function () {
  describe('When filename contains no numbers', function () {
    it('Should just return the filename', function () {
      expect(builder.build('Artist - title')).to.equal('Artist - title');
    });
  });

  describe('When song ends with a number in round brackets', function () {
    it('Should return the songname without this number and brackets', function () {
      expect(builder.build('Artist - title (1)')).to.equal('Artist - title');
    });
  });

  describe('When the song ends with a number but also contains round brackets with version name', function () {
    it('Should also return the trimmed songname with the version name', function () {
      expect(builder.build('Artist - title (maxi) (2)')).to.equal('Artist - title (maxi)');
    });
  });
});
