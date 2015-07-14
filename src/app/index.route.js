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

    .state('testApi', {
      url: '/test-api',
      views: {
        'content': {
          templateUrl: 'app/volumio/test-api.html',
          controller: 'VolumioController',
          controllerAs: 'volumio'
        }
      }
    });

  $urlRouterProvider.otherwise('/playlist');
}

export default routerConfig;
