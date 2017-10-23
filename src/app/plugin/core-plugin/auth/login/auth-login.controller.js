class AuthLoginController {
  constructor($scope, authService, $state, modalService) {
    'ngInject';
    this.$scope = $scope;
    this.authService = authService;
    this.$state = $state;
    this.modalService = modalService;

    this.user = null;
    this.authInit();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user,(user) => {
      this.user = user;
    });
  }

  login() {
    this.authService.login(this.username, this.pass).then((user) => {
      this.$state.go('volumio.auth.profile');
    }, (error) => {
      this.modalService.openDefaultErrorModal(error);
    });
  }
  
  loginWithFacebook() {
    return this.loginWithProvider('facebook');
  }

  loginWithGoogle() {
    return this.loginWithProvider('google');
  }
  
  loginWithProvider(provider) {
    return this.authService.loginWithProvider(provider).then(() => {
      this.$state.go('volumio.auth.profile');
    }).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  logOut() {
    this.authService.logOut();
  }

  goToRecoverPassword() {
    this.$state.go('volumio.auth.recover-password');
  }

}

export default AuthLoginController;