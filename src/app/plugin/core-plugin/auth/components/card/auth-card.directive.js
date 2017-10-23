class AuthCardDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/plugin/core-plugin/auth/components/card/auth-card.html',
      controller: AuthCardController,
      controllerAs: 'authCardController'
    };
    return directive;
  }
}

class AuthCardController {
  constructor($rootScope, $scope, $state, authService, modalService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;
    this.modalService = modalService;

    this.user = null;

    this.authInit();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user,(user) => {
      this.user = user;
    });
  }

  //auth section
  logIn() {
    this.$state.go('volumio.auth.login');
  }

  signUp() {
    this.$state.go('volumio.auth.signup');
  }

  goToProfile() {
    this.$state.go('volumio.auth.profile');
  }

  logOut() {
    this.authService.logOut().then(() => {
      this.$state.go('volumio.auth.login');
    }).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  isUserFilledWithMandatory() {
    return this.authService.isUserFilledWithMandatory();
  }

}

export default AuthCardDirective;
