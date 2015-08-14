function routerConfig ($stateProvider, $urlRouterProvider, themeManagerProvider) {
  'ngInject';
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
        //NOTE this resolver init also global serives like toast
        socketResolver: function($http, $window, socketService, toastMessageService){
            let apiHost = 'http://' + $window.location.hostname + ':3000/api/host';
            return $http.get(apiHost).then((response) => {
              //console.log(res);
              $window.socket = io(response.data.host + ':3000');
              socketService.host  = response.data.host + ':3000';
              toastMessageService.init();
            }, () => {
              //console.log(reason);
              //Fallback broken socket
              $window.socket = io('http://192.168.0.17:3000');
              socketService.host  = 'http://192.168.0.17:3000';
              toastMessageService.init();
            });
         }
      }
    })

    .state('volumio.browse', {
      url: 'browse',
      views: {
        'content@volumio': {
          templateUrl: 'app/browse/browse.html',
          controller: 'BrowseController',
          controllerAs: 'browse'
        }
      }
    })

    .state('volumio.playlist', {
      url: 'playlist',
      views: {
        'content@volumio': {
          templateUrl: 'app/playlist/playlist.html',
          controller: 'PlaylistController',
          controllerAs: 'playlist'
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

    .state('volumio.components', {
      url: 'components',
      views: {
        'content@volumio': {
          templateUrl: 'app/settings/components.html',
          controller: 'SettingsController',
          controllerAs: 'settings'
        }
      }
    })

    .state('volumio.multi-room', {
      url: 'multi-room',
      views: {
        'content@volumio': {
          templateUrl: 'app/multi-room-manager/multi-room-manager.html',
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
    });

  $urlRouterProvider.otherwise('/playback');
}

export default routerConfig;
