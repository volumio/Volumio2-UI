class ModalPluginInstallerController {
  constructor($uibModalInstance, dataObj, socketService, $scope) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.$scope = $scope;

    this.dataObj = dataObj;
    this.socketService = socketService;
    this.registerListner();
  }

  ok() {
    this.$uibModalInstance.close();
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }

  btnClick(button) {
    if (button.emit) {
      this.socketService.emit(button.emit, button.payload);
    }
    this.$uibModalInstance.close();
  }
  btnClick2(button) {
    this.$uibModalInstance.close();
  }

  registerListner() {
    this.socketService.on('installPluginStatus', (data) => {
      console.log('in modal', data);
      this.dataObj = data;
    });

    this.$scope.$on('$destroy', () => {
      this.socketService.off('installPluginStatus');
    });
  }
}

export default ModalPluginInstallerController;
