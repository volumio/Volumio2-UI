class MyVolumioVerificationCardDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/myvolumio/components/shareds/verification-card/myvolumio-verification-card.html',
      controller: MyVolumioVerificationCardController,
      controllerAs: 'myVolumioVerificationCardController'
    };
    return directive;
  }
}

class MyVolumioVerificationCardController {
  constructor($scope, $state, $stateParams, authService, modalService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.authService = authService;
    this.user = null;
    this.modalService = modalService;
    this.$watch = $scope.$watch;

    this.user = null;
    this.isUserVerified = true;

    this.init();
  }

  init() {
    this.authInit();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.user = user;
      this.postAuthInit();
    });
  }

  postAuthInit(user) {
    this.getUserVerified();
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
    // TODO, handle This operation is sensitive and requires recent authentication
    this.authService.logOut().then(() => {
      this.$state.go('myvolumio.access');
    }).catch((error) => {
      alert(error);
    });
  }


}

export default MyVolumioVerificationCardDirective;
