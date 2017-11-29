class AuthAlreadyLoggedDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/plugin/core-plugin/auth/components/shareds/already-logged/auth-already-logged.html',
      controller: AuthAlreadyLoggedController,
      controllerAs: 'authAlreadyLoggedController'
    };
    return directive;
  }
}

class AuthAlreadyLoggedController {
  constructor($rootScope, $scope, $state, authService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;

    this.init();
  }

  init() {

  }

  goToProfile(){
    this.$state.go('myvolumio.profile');
  }

  logOut(){
    this.authService.logOut();
  }
}

export default AuthAlreadyLoggedDirective;
