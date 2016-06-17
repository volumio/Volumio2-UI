var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var angularTranslate = require('../node_modules/gulp-angular-translate-extract/index.js');

gulp.task('exportPot', function () {
  return gulp.src(path.join(conf.paths.src, '/app/**/*.html'))
    .pipe(angularTranslate({lang: ['it']}))
    .pipe(gulp.dest(conf.paths.tmp + '/extract'));
  });
