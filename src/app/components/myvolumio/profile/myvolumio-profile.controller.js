class MyVolumioProfileController {
  constructor($scope, $state, $stateParams, authService, modalService, $q, angularFireService, user) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;
    this.modalService = modalService;
    this.$q = $q;
    this.angularFireService = angularFireService;

    this.user = user;
    this.isUserVerified = true;

    this.init();
  }

  init() {
    this.authInit();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
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
    this.$state.go('myvolumio.plans');
  }

  logIn() {
    this.$state.go('myvolumio.login');
  }

  signUp() {
    this.$state.go('myvolumio.signup');
  }

  goToEdit() {
    this.$state.go('myvolumio.edit-profile');
  }

  reAuth() {
    this.authService.logOut().then(() => {
      this.$state.go('myvolumio.access');
    }).catch((error) => {
      alert(error);
    });
  }

  logOut() {
    this.authService.logOut().then(() => {
      this.$state.go('myvolumio.access');
    }).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

}

export default MyVolumioProfileController;
