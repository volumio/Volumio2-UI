function routerConfig ($stateProvider, $urlRouterProvider, $locationProvider, themeManagerProvider) {
  'ngInject';
  console.info('[TEME]: ' + themeManagerProvider.theme, '[VARIANT]: ' + themeManagerProvider.variant);

  const resolverFn = (
    $rootScope,
    $http,
    $window,
    socketService,
    ripperService,
    modalListenerService,
    toastMessageService,
    uiSettingsService,
    updaterService) => {
      let localhostApiURL = `http://${$window.location.hostname }/api`;
      return $http.get(localhostApiURL + '/host').then((response) => {
        console.info('IP from API', response);
        $rootScope.initConfig = response.data;
        socketService.host  = response.data.host;
      }, () => {
        //Fallback socket
        console.info('IP from fallback');
        return $http.get('/app/local-config.json').then((response) => {
          socketService.host  = response.data.localhost;
        });
      });
    };

  $locationProvider.html5Mode(true);
  $stateProvider
    .state('volumio', {
      url: '/',
      abstract: true,
      views: {
        'layout': {
          templateUrl: themeManagerProvider.getHtmlPath('layout'),
          controller: 'LayoutController',
          controllerAs: 'layout'
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
        socketResolver: ($rootScope, $http, $window, socketService, ripperService, modalListenerService,
            toastMessageService, uiSettingsService, updaterService) => {
          let localhostApiURL = `http://${$window.location.hostname}/api`;
          return $http.get(localhostApiURL + '/host')
            .then((response) => {
              console.info('IP from API', response);
              $rootScope.initConfig = response.data;
              const hosts = response.data;
              const firstHostKey = Object.keys(hosts)[0];
              socketService.hosts = hosts;
              socketService.host = hosts[firstHostKey];
            }, () => {
              //Fallback socket
              console.info('Dev mode: IP from local-config.json');
              return $http.get('/app/local-config.json').then((response) => {
                // const hosts = {
                //   'host1': 'http://192.168.0.65',
                //   'host2': 'http://192.168.0.66',
                //   'host3': 'http://192.168.0.67'};
                const hosts = {'devHost': response.data.localhost};
                const firstHostKey = Object.keys(hosts)[0];
                socketService.hosts = hosts;
                socketService.host = hosts[firstHostKey];
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
      params: {isPluginSettings: null},
      views: {
        'content@volumio': {
          templateUrl: 'app/plugin/plugin.html',
          controller: 'PluginController',
          controllerAs: 'plugin'
        }
      }
    })

    .state('volumio.plugin-manager', {
      url: 'plugin-manager',
      views: {
        'content@volumio': {
          templateUrl: 'app/plugin-manager/plugin-manager.html',
          controller: 'PluginManagerController',
          controllerAs: 'pluginManager'
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
    })


    .state('volumio.redirect', {
      url: 'redirect',
      views: {
        'content@volumio': {
          template: '',
          controller: function($state, uiSettingsService, browseService) {
            uiSettingsService.initService().then((data) => {
              if (data && data.indexState) {
                if (data.indexStateHome) {
                  browseService.backHome();
                  $state.go(`volumio.${data.indexState}`);
                } else {
                  $state.go(`volumio.${data.indexState}`);
                }
              } else {
                $state.go('volumio.playback');
              }
            });
          },
          controllerAs: 'redirect'
        }
      }
    })

    .state('volumio.wizard', {
      url: 'wizard',
      views: {
        'content@volumio': {
          templateUrl: 'app/wizard/wizard.html',
          controller: 'WizardController',
          controllerAs: 'wizard'
        }
      }
    });


  $urlRouterProvider.otherwise('/redirect');
}

export default routerConfig;
