class ModalPowerOffController {
  constructor($uibModalInstance, socketService, dataObj) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.socketService = socketService;
    this.dataObj = dataObj;
  }

  powerOff() {
    this.socketService.emit('shutdown');
    this.$uibModalInstance.close();
  }

  reboot() {
    this.socketService.emit('reboot');
    this.$uibModalInstance.close();
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}

export default ModalPowerOffController;
