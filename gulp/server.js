// jshint ignore: start
// jscs:disable
'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'inject/bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  //console.log(server);

  /*
   * You can add a proxy to your backend by uncommenting the line bellow.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.0.5/README.md
   */
  // server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', proxyHost: 'jsonplaceholder.typicode.com'});

  browserSync.instance = browserSync.init({
    startPath: '/',
    scriptPath: function (path) {
      return path.substring(1);
    },
    socket: {

      // Determine the URL used by the browser client to access
      // the site, and use it to configure the browser-sync socket
      // connection:
      //
      // https://github.com/BrowserSync/browser-sync/issues/1301
      domain:
        // ___browserSync___.socket = ___browserSync___.io(
        "' + location.origin "
        + "  + location.pathname.replace(/\\/+$/, '') "
        + "  + '{ns}', "
        + "{ path: "
        + "    location.pathname.replace(/\\/+$/, '') "
        + "    + ___browserSync___.socketConfig.path }); "
        + "(0, '"
        // , ___browserSync___.socketConfig);
    },
    server: server,
    browser: browser
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['watch'], function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(conf.paths.dist);
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([conf.paths.tmp + '/serve', conf.paths.src], []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(conf.paths.dist, []);
});
