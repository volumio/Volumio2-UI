class ModalCustomController {
  constructor($uibModalInstance, dataObj, socketService) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
    this.socketService = socketService;
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
}

export default ModalCustomController;
