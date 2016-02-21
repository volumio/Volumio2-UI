// jshint ignore: start
// jscs:disable
'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var gutil = require('gulp-util');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

function webpack(watch, callback) {
  var webpackOptions = {
    watch: watch,
    module: {
      preLoaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'jshint-loader'}],
      loaders: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}]
    },
    output: { filename: 'index.module.js' }
  };

  if(watch) {
    webpackOptions.devtool = 'inline-source-map';
  }

  var webpackChangeHandler = function(err, stats) {
    if(err) {
      conf.errorHandler('Webpack')(err);
    }
    $.util.log(stats.toString({
      colors: $.util.colors.supportsColor,
      chunks: false,
      hash: false,
      version: false
    }));
    browserSync.reload();
    if(watch) {
      watch = false;
      callback();
    }
  };

  return gulp.src(path.join(conf.paths.src, '/app/index.module.js'))
    .pipe($.webpack(webpackOptions, null, webpackChangeHandler))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app')));
}

gulp.task('scripts', ['angularConfig'], function () {
  return webpack(false);
});

gulp.task('scripts:watch', ['scripts'], function (callback) {
  return webpack(true, callback);
});

gulp.task('angularConfig', function () {
  var themeSelected = gutil.env.theme ? gutil.env.theme : 'volumio';
  var themeColor, constants;
  constants = {
    theme: themeSelected
  };

  if (themeSelected === 'opera') {
    constants.knobFgColor = '#54C698';
    constants.knobBgColor = 'rgba(0,0,0,0.2)';
  } else {
    constants.knobFgColor = '#54C698';
    constants.knobBgColor = 'rgba(0,0,0,0.2)';
  }

  var obj = {
    name: 'volumio.constant',
    constants: constants,
    stream: true
  };


  return $.ngConstant(obj).pipe(gulp.dest('src/app'));
});
