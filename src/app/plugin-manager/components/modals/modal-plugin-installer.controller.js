class ModalPluginInstallerController {
  constructor($uibModalInstance, dataObj, socketService, $scope, $timeout, $translate) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.$scope = $scope;
    this.$timeout = $timeout;

    this.dataObj = dataObj;
    this.socketService = socketService;
    this.$translate = $translate;
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

  toggleAdvancedLog() {
    this.showAdvancedLog = !this.showAdvancedLog;
    this._scrollLog();
  }

  registerListner() {
    this.socketService.on('installPluginStatus', (data) => {
      this.dataObj = data;
      this._scrollLog();
      if (data.progress === 100) {
        this.socketService.off('installPluginStatus');
      }
    });

    this.$scope.$on('$destroy', () => {
      this.socketService.off('installPluginStatus');
    });
  }

  _scrollLog() {
    let advancedLogWrapper = document.querySelector('#advancedLogWrapper');
    if (advancedLogWrapper) {
      this.$timeout(() => {
        advancedLogWrapper.scrollTop = advancedLogWrapper.scrollHeight;
      }, 300, false);
    }
  }
}

export default ModalPluginInstallerController;
