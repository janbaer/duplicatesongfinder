'use strict';

var q = require('q');
var fs = require('fs');
var util = require('util');
var log = require('color-log');

var KeyStore = function (fileName) {
  this.fileName = fileName;
  this.set = new Set();
  this.isDirty = false;
};

KeyStore.prototype.load = function () {
  this.set.clear();

  if (!fs.existsSync(this.fileName)) {
    log.info(util.format('Keyfile %s not found, starting with empty keystore', this.fileName));
    return;
  }

  try {
    var content = fs.readFileSync(this.fileName);

    var keys = JSON.parse(content);

    keys.forEach(function (key) {
      if (!this.set.has(key)) {
        this.set.add(key);
        this.isDirty = true;
      }
    }.bind(this));

    log.info(util.format('Loaded %d keys into keystore from file %s', keys.length, this.fileName));
  }
  catch (error) {
    log.error(util.format('Unexpected error while loading keystore from file: %1', this.fileName), error);
  }
};

KeyStore.prototype.save = function () {
  if (!this.isDirty) {
    log.info(util.format('No data changed, keystore will not be saved.'));
    return;
  }
  var keys = [];

  this.set.forEach(function (key) {
    keys.push(key);
  });

  try {
    fs.writeFile(this.fileName, JSON.stringify(keys));
    log.info(util.format('Saved %d keys to keystore file', keys.length));
    this.isDirty = false;
  }
  catch (error) {
    log.error('Unexpected error while saving keystore', error);
  }
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
