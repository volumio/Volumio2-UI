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
        'content': {
          templateUrl: 'app/volumio/player.html'
          //controller: 'VolumioController',
          //controllerAs: 'volumio'
        },
        'footer': {
          templateUrl: 'app/footer/footer.html',
          controller: 'FooterController',
          controllerAs: 'footer'
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

    .state('volumio.testSettings', {
      url: 'test-settings',
      views: {
        'content@': {
          templateUrl: 'app/settings/test-settings.html',
          controller: 'SettingsController',
          controllerAs: 'settings'
        }
      }
    });

  $urlRouterProvider.otherwise('/playlist');
}

export default routerConfig;
