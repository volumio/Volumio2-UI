class MyVolumioAlreadyLoggedDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/myvolumio/components/shareds/already-logged/myvolumio-already-logged.html',
      controller: MyVolumioAlreadyLoggedController,
      controllerAs: 'myVolumioAlreadyLoggedController'
    };
    return directive;
  }
}

class MyVolumioAlreadyLoggedController {
  constructor($rootScope, $scope, $state, authService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;

    this.init();
  }

  init() {

  }

  goToProfile() {
    this.$state.go('myvolumio.profile');
  }

  logOut() {
    this.authService.logOut();
  }
}

export default MyVolumioAlreadyLoggedDirective;