class ModalUpdaterController {
  constructor($uibModalInstance, dataObj, updaterService, socketService) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.updaterService = updaterService;
    this.socketService = socketService;
    this.dataObj = dataObj;
  }

  update(val) {
    console.log('start update');
    this.updaterService.update(val);
    if (val === 'later') {
      this.$uibModalInstance.close();
    }
  }

  reboot() {
    this.socketService.emit('reboot');
    this.$uibModalInstance.close();
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}

export default ModalUpdaterController;
