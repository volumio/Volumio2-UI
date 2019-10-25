class ModalProgressCustomController {
  constructor($uibModalInstance, dataObj, updaterService, socketService, $log, $translate, modalService) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.modalService = modalService;
    this.socketService = socketService;
    this.dataObj = dataObj;
    this.$log = $log;
    this.$translate = $translate;
  }

  update(val) {
    this.$log.debug('start update');
    this.updaterService.update(val);
    if (val === 'later') {
      this.$uibModalInstance.close();
    }
  }

  ok() {
    this.$uibModalInstance.close();
  }

  btnClick(button) {
    if (button.emit) {
      this.socketService.emit(button.emit, button.payload);
    }
    this.$uibModalInstance.close();
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}

export default ModalProgressCustomController;
