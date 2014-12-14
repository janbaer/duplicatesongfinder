'use strict';

var q = require('q');
var fs = require('fs');
var util = require('util');
var log = require('color-log');

var KeyStore = function (fileName) {
  this.fileName = fileName;
  this.set = new Set();
};

KeyStore.prototype.load = function () {
  this.set.clear();

  if (!fs.existsSync(this.fileName)) {
    log.info(util.format('Keyfile %s not found, starting with empty keystore', this.fileName));
    return;
  }

  var content = fs.readFileSync(this.fileName);

  var keys = JSON.parse(content);

  keys.forEach(function (key) {
    if (!this.set.has(key)) {
      this.set.add(key);
    }
  }.bind(this));

  log.info(util.format('Loaded %d keys into keystore from file %s', keys.length, this.fileName));
};

KeyStore.prototype.save = function () {
  var keys = [];

  this.set.forEach(function (key) {
    keys.push(key);
  });

  log.info(util.format('Saving %d keys to keystore file', keys.length));

  fs.writeFile(this.fileName, JSON.stringify(keys));
};

KeyStore.prototype.add = function (key) {
  if (!this.set.has(key)) {
    this.set.add(key);
  }
};

KeyStore.prototype.has = function (key) {
  return this.set.has(key);
};

KeyStore.prototype.clear = function () {
  this.set.clear();
};

module.exports = KeyStore;
