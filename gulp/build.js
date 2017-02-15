// jshint ignore: start
// jscs:disable
'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
    path.join(conf.paths.src, '/app/**/*.html'),
    path.join(conf.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'volumio',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.replace('../../inject/bower_components/bootstrap-sass-official/assets/fonts/bootstrap/', '../fonts/'))
    .pipe($.replace('../../inject/bower_components/components-font-awesome/fonts', '../fonts/'))
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      conditionals: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  var paths = $.mainBowerFiles()
  paths.push('inject/bower_components/bootstrap-sass-official/**');
  return gulp.src(paths)
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('fontawesome', function() {
  return gulp.src('inject/bower_components/components-font-awesome/fonts/*.*')
          .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join('!' + conf.paths.src, '/app/themes/**/*'),
    path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('theme', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  var themeSelected = gutil.env.theme ? gutil.env.theme : 'volumio';
  var variantSelected = gutil.env.variant ? gutil.env.variant : 'volumio';
  return gulp.src([
    path.join(conf.paths.src, '/app/themes/' + themeSelected + '/**/*'),
    path.join('!' + conf.paths.src, '/app/themes/' + themeSelected + '/assets/variants/!('+variantSelected+')/**/*'),
    // path.join(conf.paths.src, '/app/themes/' + themeSelected + '/assets/variants/' + variantSelected + '/**/*')
    // path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/app/themes/' + themeSelected)));
});

gulp.task('static-pages', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });
  var themeSelected = gutil.env.theme ? gutil.env.theme : 'volumio';

  return gulp.src([
    path.join(conf.paths.src, '/app/themes/' + themeSelected + '/assets/static-pages/*')
  ])
  // .pipe(fileFilter)
  .pipe(gulp.dest(path.join(conf.paths.dist, '/app/themes/' + themeSelected + '/assets/static-pages')));
});

gulp.task('clean', function (done) {
  $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')], done);
});

gulp.task('credits', function (cb) {
  var themeSelected = gutil.env.theme ? gutil.env.theme : 'volumio';
  exec('node src/app/themes/' + themeSelected + '/scripts/credits.js ' + themeSelected, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

gulp.task('build', ['credits','html', 'fonts', 'fontawesome', 'other', 'static-pages', 'theme']);
