function routerConfig ($stateProvider, $urlRouterProvider,
      $locationProvider, themeManagerProvider) {
  'ngInject';
  console.info('[TEME]: ' + themeManagerProvider.theme);

  $locationProvider.html5Mode(true);
  $stateProvider
    .state('volumio', {
      url: '/',
      abstract: true,
      views: {
        'layout': {
          templateUrl: themeManagerProvider.getHtmlPath('layout', '')
        },
        'header@volumio': {
          templateUrl: themeManagerProvider.getHtmlPath('header'),
          controller: 'HeaderController',
          controllerAs: 'header'
        },
        'footer@volumio': {
          templateUrl: themeManagerProvider.getHtmlPath('footer'),
          controller: 'FooterController',
          controllerAs: 'footer'
        }
      },
      resolve: {
        //NOTE this resolver init also global services like toast
        socketResolver: (
          $rootScope,
          $http,
          $window,
          socketService,
          toastMessageService,
          updaterService) => {
            let localhostApiURL = `http://${$window.location.hostname }/api`;
            return $http.get(localhostApiURL + '/host').then((response) => {
              console.info('IP from API', response);
              $rootScope.initConfig = response.data;
              socketService.host  = response.data.host;
              toastMessageService.init();
              updaterService.init();
            }, () => {
              //Fallback socket
              console.info('IP from fallback');
              return $http.get('/app/local-config.json').then((response) => {
                socketService.host  = response.data.localhost;
                toastMessageService.init();
                updaterService.init();
              });
            });
          }
      }
    })

    .state('volumio.browse', {
      url: 'browse',
      views: {
        'content@volumio': {
          templateUrl: themeManagerProvider.getHtmlPath('browse'),
          controller: 'BrowseController',
          controllerAs: 'browse'
        }
      }
    })

    .state('volumio.play-queue', {
      url: 'queue',
      views: {
        'content@volumio': {
          templateUrl: themeManagerProvider.getHtmlPath('play-queue'),
          controller: 'PlayQueueController',
          controllerAs: 'playQueue'
        }
      }
    })

    .state('volumio.playback', {
      url: 'playback',
      views: {
        'content@volumio': {
          templateUrl: themeManagerProvider.getHtmlPath('playback'),
          controller: 'PlaybackController',
          controllerAs: 'playback'
        }
      }
    })

    .state('volumio.debug', {
      url: 'debug',
      views: {
        'content@volumio': {
          templateUrl: 'app/components/debug/volumio-debug.html',
          controller: 'DebugController',
          controllerAs: 'debug'
        }
      }
    })

    .state('volumio.multi-room', {
      url: 'multi-room',
      views: {
        'content@volumio': {
          templateUrl: 'app/themes/axiom/multi-room-manager/axiom-multi-room-manager.html',
          controller: 'MultiRoomManagerController',
          controllerAs: 'multiRoomManager'
        }
      }
    })

    .state('volumio.plugin', {
      url: 'plugin/:pluginName',
      views: {
        'content@volumio': {
          templateUrl: 'app/plugin/plugin.html',
          controller: 'PluginController',
          controllerAs: 'plugin'
        }
      }
    })

    .state('volumio.static-page', {
      url: 'static-page/:pageName',
      views: {
        'content@volumio': {
          templateUrl: 'app/static-pages/static-page.html',
          controller: 'StaticPageController',
          controllerAs: 'staticPage'
        }
      }
    });

  $urlRouterProvider.otherwise('/playback');
}

export default routerConfig;
