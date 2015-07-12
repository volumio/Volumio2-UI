function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('player', {
      url: '/',
      templateUrl: 'app/volumio/player.html',
      controller: 'VolumioController',
      controllerAs: 'volumio'
    })
    .state('testApi', {
      url: '/test-api',
      templateUrl: 'app/volumio/test-api.html',
      controller: 'VolumioController',
      controllerAs: 'volumio'
    });

  $urlRouterProvider.otherwise('/');
}

export default routerConfig;
