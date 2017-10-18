class AuthVerificationCardDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/plugin/core-plugin/auth/components/shareds/verification-card/auth-verification-card.html',
      controller: AuthVerificationCardController,
      controllerAs: 'authVerificationCardController'
    };
    return directive;
  }
}

class AuthVerificationCardController {
   constructor($scope, $state, $stateParams, authService, modalService) {
    'ngInject';
    this.$state = $state;
    this.authService = authService;
    this.user = null;
    this.modalService = modalService;

    this.isUserVerified = true;

    this.init();
  }

  init() {
    this.authInit();
  }

  authInit() {
    this.authService.getUserPromise().then((user) => {
      this.postAuthInit(user);
      this.authService.bindWatcher(this.getAuthWatcher());
    }).catch((error) => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  getAuthWatcher() {
    return (user) => {
      this.postAuthInit(user);
    };
  }

  postAuthInit(user) {
    this.setUser(user);
    this.getUserVerified();
  }

  setUser(user) {
    this.user = user;
  }

  getUserVerified() {
    this.authService.isUserVerified().then(() => {
      this.isUserVerified = true;
    }).catch((error) => {
      this.isUserVerified = false;
    });
  }

  resendEmailVerification() {
    this.authService.resendEmailVerification();
  }

  reAuth() {
    this.authService.logOut().then(() => {
      this.$state.go('volumio.auth.login');
    }).catch((error) => {
      alert(error);
    });
  }


}

export default AuthVerificationCardDirective;
