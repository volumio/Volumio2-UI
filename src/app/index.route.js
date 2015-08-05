function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('volumio', {
      url: '/',
      views: {
        'header': {
          templateUrl: 'app/header/header.html',
          controller: 'HeaderController',
          controllerAs: 'header'
        },
        'footer': {
          templateUrl: 'app/footer/footer.html',
          controller: 'FooterController',
          controllerAs: 'footer'
        }
      },
      resolve: {
        socketResolver: function($http, $window, socketService){
            let apiHost = 'http://' + $window.location.hostname + ':3000/api/host';
            return $http.get(apiHost).then((response) => {
              //console.log(res);
              $window.socket = io(response.data.host + ':3000');
              socketService.host  = response.data.host + ':3000';
            }, () => {
              //console.log(reason);
              //Fallback broken socket
              $window.socket = io('http://192.168.0.17:3000');
              socketService.host  = 'http://192.168.0.17:3000';
            });
         }
      }
    })

    .state('volumio.browse', {
      url: 'browse',
      views: {
        'content@': {
          templateUrl: 'app/browse/browse.html',
          controller: 'BrowseController',
          controllerAs: 'browse'
        }
      }
    })

    .state('volumio.playlist', {
      url: 'playlist',
      views: {
        'content@': {
          templateUrl: 'app/playlist/playlist.html',
          controller: 'PlaylistController',
          controllerAs: 'playlist'
        }
      }
    })

    .state('volumio.playback', {
      url: 'playback',
      views: {
        'content@': {
          templateUrl: 'app/playback/playback.html',
          controller: 'PlaybackController',
          controllerAs: 'playback'
        }
      }
    })

    .state('volumio.components', {
      url: 'components',
      views: {
        'content@': {
          templateUrl: 'app/settings/components.html',
          controller: 'SettingsController',
          controllerAs: 'settings'
        }
      }
    })

    .state('volumio.multi-room', {
      url: 'multi-room',
      views: {
        'content@': {
          templateUrl: 'app/multi-room-manager/multi-room-manager.html',
          controller: 'MultiRoomManagerController',
          controllerAs: 'multiRoomManager'
        }
      }
    })

    .state('volumio.plugin', {
      url: 'plugin/:pluginName',
      views: {
        'content@': {
          templateUrl: 'app/plugin/plugin.html',
          controller: 'PluginController',
          controllerAs: 'plugin'
        }
      }
    });

  $urlRouterProvider.otherwise('/playlist');
}

export default routerConfig;
