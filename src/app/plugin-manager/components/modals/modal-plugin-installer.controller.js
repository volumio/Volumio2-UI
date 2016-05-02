class ModalPluginInstallerController {
  constructor($uibModalInstance, dataObj, socketService, $scope, $timeout) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.$scope = $scope;
    this.$timeout = $timeout;

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

  registerListner() {
    this.socketService.on('installPluginStatus', (data) => {
      console.log('in modal', data);
      this.dataObj = data;
      let advancedLogWrapper = document.querySelector('#advancedLogWrapper');
      if (advancedLogWrapper) {
        this.$timeout(() => {
          advancedLogWrapper.scrollTop = advancedLogWrapper.scrollHeight;
        }, 300, false);
      }
    });

    this.$scope.$on('$destroy', () => {
      this.socketService.off('installPluginStatus');
    });
  }
}

export default ModalPluginInstallerController;
