#! /usr/bin/env node

'use strict';

var fs = require('fs');
//var path       = require('path');

var program = require('commander');

program.version('0.0.1')
       .option('-d, --directory', 'name of the directory')
       .option('-wi, --what-if', 'simulates the operations only')
       .parse(process.argv);

if (program.directory === undefined) {
  console.log('You have to provide the name of the directory in the -d argument!');
  return;
}


