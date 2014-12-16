'use strict';

var fs = require('fs'),
    program = require('commander'),
    path = require('path'),
    util = require('util'),
    log = require('color-log'),
    watch = require('node-watch'),
    directoryReader = require('./lib/directoryReader.js'),
    FileChecker = require('./lib/fileChecker.js'),
    Queue = require('./lib/queue.js'),
    KeyStore = require('./lib/keystore.js');

var isProduction = process.env.NODE_ENV === 'production';

log.info(util.format('You are working in %s mode', isProduction ? 'production' : 'dev'));

program.version('0.0.2')
       .option('-d, --directory', 'name of the directory')
       .option('-w, --what-if', 'simulates the operations only')
       .parse(process.argv);

var whatIf = program.whatIf !== undefined;
var queue = new Queue();
var keyStore = new KeyStore(path.resolve(path.join('./config', 'mp3keys.json')));
var fileChecker = new FileChecker(keyStore);
var directories = [];
var watchingIsActive = false, isWaitingForSaveKeyStore = false;

if (program.directory) {
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

var saveKeyStore = function () {
  if (isWaitingForSaveKeyStore) {
    return;
  }

  isWaitingForSaveKeyStore = true;

  setTimeout(function () {
    keyStore.save();
    isWaitingForSaveKeyStore = false;
  }, 5 * 1000);
};

var addFileToWorkingQueue = function (filePath) {
  queue.push(filePath);
};

var processFiles = function () {
  while(queue.canPop()) {
    var key = queue.pop();
    fileChecker.checkFile(key);
  }

  watchDirectories();
};

var initDirectories = function (directories) {
  directories.forEach(function (directory) {
    directoryReader.init(directory);
  });
};

var checkDirectories = function (directories) {
  directories.forEach(function (directory) {
    directoryReader.readDir(directory, addFileToWorkingQueue);
  });
};

var watchDirectory = function (directoryPath, whatIf) {
  log.info(util.format('Watching "%s"', directoryPath));

  watch(directoryPath, { recursive: false }, function(filePath) {
    if (fs.existsSync(filePath) && directoryReader.isMp3File(filePath)) {
      addFileToWorkingQueue(filePath);
      processFiles();
      saveKeyStore();
    }
  });
};


/* jshint -W003 */
var watchDirectories = function () {
  if (watchingIsActive) {
    return;
  }

  log.info('Now I am going into the watch mode');
  watchingIsActive = true;

  directories.forEach(function (directoryPath) {
    if (!directoryReader.existsDir(directoryPath)) {
      log.warn(util.format('Directory "%s" was not found and could not be watched', directoryPath));
      return;
    }
    watchDirectory(directoryPath, whatIf);
  });
};

keyStore.load();

initDirectories(directories);

saveKeyStore();

log.info(util.format('Start with checking %d directories', directories.length));

checkDirectories(directories);

log.info(util.format('Processing now %d files', queue.count()));

processFiles(queue);




