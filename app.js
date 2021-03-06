'use strict';

var fs = require('fs'),
    program = require('commander'),
    util = require('util'),
    path = require('path'),
    log = require('color-log'),
    Q = require('q'),
    watch = require('node-watch');

var isProduction = process.env.NODE_ENV === 'production';

log.info(util.format('You are working in %s mode', isProduction ? 'production' : 'dev'));

var directoryReader = require('./lib/directoryReader.js');

program.version('0.0.1')
       .option('-d, --directory', 'name of the directory')
       .option('-w, --what-if', 'simulates the operations only')
       .parse(process.argv);

var whatIf = program.whatIf !== undefined;
var directories = [];

if (program.directory !== undefined) {
  directories.push(program.directory);
} else {
  var configFile = isProduction ? './config/config.json' : './config/config.dev.json';
  directories = require(configFile);
  if (directories.length === 0) {
    log.warn(util.format('No directories defined in %s', configFile));
    return;
  }
}

if (whatIf) {
  log.info('Simulating file operations only...');
}

var filter = function(pattern, callback) {
  return function(filename) {
    if (pattern.test(filename)) {
      callback(filename);
    }
  };
};

var processDirectories = function (directories, whatIf, callback) {
  var promises = [];

  directories.forEach(function (directory) {
    promises.push(callback(directory, whatIf));
  });

  return Q.all(promises);
};

var initAllDirectories = function () {
  return processDirectories(directories, whatIf, directoryReader.init);
};

var checkAllDirectories = function () {
  return processDirectories(directories, whatIf, directoryReader.readDir);
};

var watchDirectory = function (directoryPath, whatIf) {
  log.info(util.format('Watching "%s"', directoryPath));

  watch(directoryPath, { recursive: false }, filter(/\.mp3$/, function(filename) {
    if (fs.existsSync(filename)) {
      log.info(util.format('New file "%s" in directory "%s"', filename, directoryPath));
      var files = [];
      files.push(path.basename(filename));
      directoryReader.readFiles(directoryPath, files, whatIf)
        .catch(function (error) {
          log.error(util.format('Error while checking new files in "%s": %s', directoryPath, error));
        });
    }
  }));
};

var watchAllDirectories = function () {
  log.info('All directories successful processed...');
  log.info('Now I am going into the watch mode');
  directories.forEach(function (directoryPath) {
    directoryReader.existsDir(directoryPath).then(function (exists) {
      if (!exists) {
        log.warn(util.format('Directory "%s" was not found and could not be watched', directoryPath));
      } else {
        watchDirectory(directoryPath, whatIf);
      }
    });
  });
};

Q.fcall(initAllDirectories)
  .then(checkAllDirectories)
  .then(watchAllDirectories)
  .catch(function (error) {
    log.error(util.format('Error while processing the defined directories: %s', error));
  })
  .done();
