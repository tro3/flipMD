// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    preprocessors: {
      '*/.html': [],
      '**/*.coffee': ['coffee']
    },

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/marked/lib/marked.js',
      'build/flipMD.min.js',
      'src/**/*.spec.js',
      'src/**/*.spec.coffee'
    ],

    exclude: [],

    reporters: ['dots'],

    port: 8080,

    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['Chrome'],

    singleRun: true
  });
};