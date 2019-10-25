class MyVolumioCloudSelectDeviceController {
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
      this.$state.go('myvolumio.login');
    }
  }


}

export default MyVolumioCloudSelectDeviceController;