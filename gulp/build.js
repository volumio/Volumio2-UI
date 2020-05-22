// jshint ignore: start
// jscs:disable
'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var gutil = require('gulp-util');
var exec = require('child_process').exec;

var themeSelected = gutil.env.theme ? gutil.env.theme : 'volumio';
var variantSelected = gutil.env.variant ? gutil.env.variant : 'volumio';

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

gulp.task('html', ['inject', 'partials'], function (cb) {
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
    .pipe($.replace('../../bower_components/bootstrap-sass-official/assets/fonts/bootstrap/', '../fonts/'))
    .pipe($.replace('../../bower_components/components-font-awesome/fonts', '../fonts/'))
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
    cb(err);
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  var paths = $.mainBowerFiles()
  paths.push('bower_components/bootstrap-sass-official/**');
  return gulp.src(paths)
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('fontawesome', function() {
  return gulp.src('bower_components/components-font-awesome/fonts/*.*')
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

  return gulp.src([
    path.join(conf.paths.src, '/app/themes/' + themeSelected + '/assets/**/*'),
    path.join('!' + conf.paths.src, '/app/themes/' + themeSelected + '/assets/variants/!(' + variantSelected + ')/**/*'),
    // path.join(conf.paths.src, '/app/themes/' + themeSelected + '/assets/variants/'+variantSelected+'/**/*'),
    // path.join(conf.paths.src, '/app/themes/' + themeSelected + '/assets/variants/' + variantSelected + '/**/*')
    // path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
  ])
  .pipe(fileFilter)
  .pipe(gulp.dest(path.join(conf.paths.dist, '/app/themes/' + themeSelected + '/assets')));
});

//Set static page title to remove FOUC
gulp.task('replace-page-title', ['html'], function () {
  var fs = require('fs');
  var themeSettings =
      fs.readFileSync(`${conf.paths.src}/app/themes/${themeSelected}/assets/variants/${variantSelected}/${variantSelected}-settings.json`, 'utf8');
  themeSettings = JSON.parse(themeSettings);

  var pageTitle = themeSettings.pageTitle || 'Audiophile music player';
  var index = fs.readFileSync(`dist/index.html`, 'utf8');
  index = index.replace('<title></title>', `<title>${pageTitle}</title>`);
  index = index.replace(/@APP_NAME/g, themeSettings.app || '');
  index = index.replace(/@BAR_COLOR/g, themeSettings.addressBarColor || '');
  fs.writeFileSync('dist/index.html', index);
});

//Set static page title to remove FOUC
gulp.task('meta-cards', ['html'], function () {
  var fs = require('fs');
  var metaCardsContent = '';
  if (variantSelected === 'volumio') {
    var websiteUrl = 'https://myvolumio.org';
    if (gutil.env.env === 'development') {
      websiteUrl = 'https://myvolumio-dev.firebaseapp.com';
    }
    var tagline = 'The audiophile music player designed and fine-tuned for high quality music playback';
    var title = 'Volumio - The Audiophile Music Player';
    var metaImageUrl = websiteUrl + '/app/assets-common/volumio-meta.jpg';
    metaCardsContent = '<meta property="og:type" content="website">';
    metaCardsContent  += '<meta property="og:url" content="'+ websiteUrl +'">';
    metaCardsContent  += '<meta property="og:title" content="' + title +'">';
    metaCardsContent  += '<meta property="og:image" content="' + metaImageUrl + '">';
    metaCardsContent  += '<meta property="og:description" content="' + tagline +'">';
    metaCardsContent  += '<meta property="og:site_name" content="Volumio">';
    metaCardsContent  += '<meta property="og:locale" content="en_US">';
    metaCardsContent  += '<meta property="og:image:width" content="1200">';
    metaCardsContent  += '<meta property="og:image:height" content="630">';
    metaCardsContent  += '<meta name="twitter:card" content="summary">';
    metaCardsContent  += '<meta name="twitter:site" content="@volumio">';
    metaCardsContent  += '<meta name="twitter:url" content="'+ websiteUrl +'">';
    metaCardsContent  += '<meta name="twitter:title" content="' + title +'">';
    metaCardsContent  += '<meta name="twitter:description" content="' + tagline +'">';
    metaCardsContent  += '<meta name="twitter:image" content="' + metaImageUrl + '">';
  }
  var index = fs.readFileSync(`dist/index.html`, 'utf8');
  index = index.replace('<meta-cards></meta-cards>', metaCardsContent);
  fs.writeFileSync('dist/index.html', index);
});

gulp.task('static-pages', ['credits'], function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(conf.paths.src, '/app/themes/' + themeSelected + '/assets/static-pages/*')
  ])
  // .pipe(fileFilter)
  .pipe(gulp.dest(path.join(conf.paths.dist, '/app/themes/' + themeSelected + '/assets/static-pages')));
});

gulp.task('clean', function (done) {
  $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/'), path.join(conf.paths.src, '/app/themes/' + themeSelected + '/assets/variants/' + variantSelected + '/dist')], done);
});

gulp.task('credits', function (cb) {
  exec('node src/app/themes/' + themeSelected + '/scripts/credits.js ' + themeSelected + ' ' + variantSelected, function (err, stdout, stderr) {
    cb(err);
  });
})

gulp.task('build-app', ['credits', 'fonts', 'fontawesome', 'other', 'static-pages', 'theme', 'replace-page-title', 'meta-cards']);
