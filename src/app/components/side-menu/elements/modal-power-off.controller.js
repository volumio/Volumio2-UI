class ModalPowerOffController {
  constructor($modalInstance, socketService, dataObj) {
    'ngInject';
    this.$modalInstance = $modalInstance;
    this.socketService = socketService;
    this.dataObj = dataObj;
  }

  powerOff() {
    this.socketService.emit('shutdown');
    this.$modalInstance.close();
  }

  reboot() {
    this.socketService.emit('reboot');
    this.$modalInstance.close();
  }

  cancel() {
    this.$modalInstance.dismiss('cancel');
  }
}

export default ModalPowerOffController;
