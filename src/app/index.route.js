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
          $http,
          $window,
          socketService,
          toastMessageService,
          updaterService) => {
            let apiHost = 'http://' + $window.location.hostname + ':3000/api/host';
            return $http.get(apiHost).then((response) => {
              //console.log(res);
              $window.socket = io(response.data.host + ':3000');
              socketService.host  = response.data.host + ':3000';
              toastMessageService.init();
              updaterService.init();
            }, () => {
              //console.log(reason);
              //Fallback broken socket
              $window.socket = io('http://192.168.0.31:3000');
              socketService.host  = 'http://192.168.0.31:3000';
              toastMessageService.init();
              updaterService.init();
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
          templateUrl: 'app/themes/volumio/debug/volumio-debug.html',
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
          templateUrl: 'app/themes/volumio/plugin/volumio-plugin.html',
          controller: 'PluginController',
          controllerAs: 'plugin'
        }
      }
    });

  $urlRouterProvider.otherwise('/browse');
}

export default routerConfig;
