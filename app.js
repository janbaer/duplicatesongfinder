#! /usr/bin/env node

'use strict';

var fs = require('fs'),
    program = require('commander'),
    Q = require('q');

var directoryReader = require('./lib/directoryReader.js');

program.version('0.0.1')
       .option('-d, --directory', 'name of the directory')
       .option('-wi, --what-if', 'simulates the operations only')
       .parse(process.argv);

var whatIf = program.whatIf !== undefined;
var directories = [];

if (program.directory !== undefined) {
  directories.push(program.directory);
} else {
  directories = require('./config/config.dev.json');
}

var promises = [];

directories.forEach(function (directory) {
  var promise = directoryReader.init(directory).then(directoryReader.readDir(directory, whatIf));
  promises.push(promise);
});

Q.all(promises).done(function () {
  console.log('All directories successful processed...');

  console.info('Now I am going into the watch mode');

}, function (error) {
  console.error('Error while processing the defined directories: %s', error);
});






