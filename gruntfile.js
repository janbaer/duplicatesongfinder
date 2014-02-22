'use strict';

module.exports = function (grunt) {
  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
        'gruntfile.js',
        'app.js',
        'lib/**/*.js',
        'test/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: '',
          timeout: 3000,
          ui: 'bdd'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        options: {
          file: './app.js',
          args: [],
          nodeArgs: ['--debug'],
          watchedExtensions: ['js'],
          watchedFolders: ['api', 'lib'],
          delayTime: 1,
          legacyWatch: true,
          env: {
            PORT: '3000'
          },
          cwd: __dirname
        }
      },
      prod: {
        options: {
          file: './app.js',
          args: [],
          nodeArgs: [],
          ignoredFiles: ['README.md', 'node_modules/**'],
          watchedExtensions: ['js'],
          watchedFolders: ['api', 'lib'],
          delayTime: 1,
          legacyWatch: true,
          env: {
            PORT: '3000',
            NODE_ENV: 'production'
          },
          cwd: __dirname
        }
      },
    },

    watch: {
      mocha: {
        files: ['app.js', 'api/**/*.js', 'lib/**/*.js', 'test/**/*.js'],
        tasks: ['jshint', 'mochaTest']
      },
    }

  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'mochaTest', 'watch']);

  // Test task
  grunt.registerTask('test', ['jshint', 'mochaTest']);

};
