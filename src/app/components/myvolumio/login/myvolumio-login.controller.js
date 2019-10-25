class MyVolumioLoginController {
  constructor($scope, $state, modalService, authService, user) {
    'ngInject';
    this.$scope = $scope;
    this.authService = authService;
    this.$state = $state;
    this.modalService = modalService;

    this.user = user;
    this.authInit();

  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.postAuthInit();
    });
  }

  postAuthInit() {
    if (this.user !== null) {
      this.$state.go('myvolumio.profile');
    }
  }

  login() {
    this.authService.login(this.username, this.pass).then((user) => {
      this.$state.go('myvolumio.profile');
    }, (error) => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  loginWithFacebook() {
    this.loginWithProvider('facebook');
  }

  loginWithGoogle() {
    this.loginWithProvider('google');
  }

  loginWithGithub() {
    this.loginWithProvider('github');
  }

  loginWithProvider(provider) {
    this.authService.loginWithProvider(provider).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  logOut() {
    this.authService.logOut();
  }

  goToRecoverPassword() {
    this.$state.go('myvolumio.recover-password');
  }

  isSocialEnabled() {
    return this.authService.isSocialEnabled();
  }

  goToSignUp() {
    this.$state.go('myvolumio.signup');
  }

}

export default MyVolumioLoginController;