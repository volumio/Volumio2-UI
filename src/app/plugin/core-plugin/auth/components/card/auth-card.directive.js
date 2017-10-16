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
    this.authService.getUserPromise(false).then((user) => {
      this.init(user);
      this.authService.bindWatcher(this.getAuthWatcher(), false);
    }).catch((error) => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  getAuthWatcher() {
    return (user) => {
      this.init(user);
    };
  }

  init(user) {
    this.setUser(user);
  }

  setUser(user) {
    this.user = user;
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
    this.authService.logOut();
  }

  isUserFilledWithMandatory() {
    return this.authService.isUserFilledWithMandatory();
  }

}

export default AuthCardDirective;
