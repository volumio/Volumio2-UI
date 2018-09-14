class ModalPasswordController {
  constructor($scope, $uibModalInstance, dataObj, socketService) {
    'ngInject';
    this.socketService = socketService;
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
    this.showError = false;

    this.registerListner();
  }

  ok() {
    this.showError = false;
    if (this.form.$valid) {
      this.socketService.emit('checkPassword', {
        password: this.password,
        pluginName: this.dataObj.pluginName
      });
    }
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  registerListner() {
    this.socketService.on('checkPassword', (response) => {
      if (response) {
        this.$uibModalInstance.close(true);
      } else {
        this.showError = true;
      }
    });

    this.$scope.$on('$destroy', () => {
      this.socketService.off('checkPassword');
    });
  }
}

export default ModalPasswordController;
