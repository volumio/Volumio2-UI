// jshint ignore: start
// jscs:disable
'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var gutil = require('gulp-util');
var filter = require('gulp-filter');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('styles', function () {
  var sassOptions = {
    style: 'expanded'
  };

  var theme = gutil.env.theme ? gutil.env.theme : 'volumio';
  var variant = gutil.env.variant ? gutil.env.variant : 'volumio';
  // console.log('Theme', theme, 'Variant', variant);


  var fs = require('fs');
  fs.writeFileSync('src/app/themes/' + theme + '/assets/variants/load-variant.scss',
    '@import "./' + variant + '/' + variant + '-variant"; $theme:"' + theme + '"; $variant:"' + variant + '";');

  fs.writeFileSync('src/app/themes/' + theme + '/assets/variants/' + variant + '/globals.scss',
    '$theme:"' + theme + '"; $variant:"' + variant + '";');

  var injectFiles = gulp.src([
    path.join(conf.paths.src, '/app/styles/**/*.scss'),
    path.join(conf.paths.src, '/app/themes/'+theme+'/'+theme+'-style.scss'),
    path.join('!' + conf.paths.src, '/app/index.scss'),
    path.join(conf.paths.src, '/app/**/*.scss'),
    // Disable other themes
    path.join('!' + conf.paths.src, '/app/themes/!('+theme+')/**/*'),
    // Disable import other theme variants
    path.join('!' + conf.paths.src, '/app/themes/'+theme+'/assets/variants/!('+variant+')/**/*')
  ], { read: true });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(conf.paths.src + '/app/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };


  return gulp.src([
    path.join(conf.paths.src, '/app/index.scss')
  ])
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    // .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')));
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
    .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')))
    .pipe(browserSync.reload({ stream: true }));
 });
