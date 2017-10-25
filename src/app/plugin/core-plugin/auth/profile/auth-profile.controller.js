class AuthProfileController {
  constructor($scope, $state, $stateParams, authService, modalService, $q, angularFireService, user) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;
    this.modalService = modalService;
    this.$q = $q;
    this.angularFireService = angularFireService;

    this.user = user;
    this.isUserVerified = false;

    this.init();
  }

  init() {
    this.authInit();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user,(user) => {
      this.user = user;
      this.initUserVerified();
    });
  }

  initUserVerified() {
    var verifying = this.$q.defer();
    this.authService.isUserVerified().then(() => {
      this.isUserVerified = true;
      verifying.resolve(true);
    }).catch((error) => {
      this.isUserVerified = false;
      verifying.resolve(false);
    });
    return verifying.promise;
  }

  resendEmailVerification() {
    this.authService.resendEmailVerification();
  }

  goToPlans() {
    this.$state.go('volumio.auth.plans');
  }

  logIn() {
    this.$state.go('volumio.auth.login');
  }

  goToEdit() {
    this.$state.go('volumio.auth.edit-profile');
  }

  reAuth() {
    this.authService.logOut().then(() => {
      this.$state.go('volumio.auth.login');
    }).catch((error) => {
      alert(error);
    });
  }

}

export default AuthProfileController;