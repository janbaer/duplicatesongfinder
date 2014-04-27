'use strict';

var build = function (song) {
  var regex = /^(.*)(?:\(\d\)*)$/;
  var match = regex.exec(song);
  if (match) {
    return match[1].trim();
  }
  return song;
};

module.exports.build = build;
