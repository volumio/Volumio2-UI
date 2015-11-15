class ModalUpdaterController {
  constructor($modalInstance, dataObj, updaterService, socketService) {
    'ngInject';
    this.$modalInstance = $modalInstance;
    this.updaterService = updaterService;
    this.socketService = socketService;
    this.dataObj = dataObj;
  }

  update(val) {
    this.updaterService.update(val);
    if (val === 'later') {
      this.$modalInstance.close();
    }
  }

  reboot() {
    this.socketService.emit('reboot');
    this.$modalInstance.close();
  }

  cancel() {
    this.$modalInstance.dismiss('cancel');
  }
}

export default ModalUpdaterController;
