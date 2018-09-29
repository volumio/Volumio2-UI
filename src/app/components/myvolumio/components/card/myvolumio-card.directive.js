class MyVolumioCardDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/myvolumio/components/card/myvolumio-card.html',
      controller: MyVolumioCardController,
      controllerAs: 'myVolumioUserCardController',
      scope: {
        'actionCallback': '&'
      }
    };
    return directive;
  }
}

class MyVolumioCardController {
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
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.user = user;
    });
  }

  //auth section
  logIn() {
    this.actionCallback();
    this.$state.go('myvolumio.login');
  }

  signUp() {
    this.actionCallback();
    this.$state.go('myvolumio.signup');
  }

  goToProfile() {
    this.actionCallback();
    this.$state.go('myvolumio.profile');
  }

  logOut() {
    this.authService.logOut().then(() => {
      this.actionCallback();
      this.$state.go('myvolumio.access');
    }).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  isUserFilledWithMandatory() {
    return this.authService.isUserFilledWithMandatory();
  }

}

export default MyVolumioCardDirective;