class AuthCardDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/plugin/core-plugin/auth/components/card/auth-card.html',
      controller: AuthCardController,
      controllerAs: 'authCardController',
      scope:{
        'actionCallback': '&'
      }
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
    this.actionCallback = this.$scope.actionCallback;

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
    this.actionCallback();
    this.$state.go('volumio.auth.login');
  }

  signUp() {
    this.actionCallback();
    this.$state.go('volumio.auth.signup');
  }

  goToProfile() {
    this.actionCallback();
    this.$state.go('volumio.auth.profile');
  }

  logOut() {
    this.authService.logOut().then(() => {
      this.actionCallback();
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
