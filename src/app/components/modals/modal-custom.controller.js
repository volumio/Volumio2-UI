class ModalCustomController {
  constructor($uibModalInstance, dataObj, socketService, $translate) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
    this.socketService = socketService;
    this.$translate = $translate;
  }

  ok() {
    this.$uibModalInstance.close();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  btnClick(button) {
    if (button.emit) {
      this.socketService.emit(button.emit, button.payload);
    }
    this.$uibModalInstance.close();
  }
}

export default ModalCustomController;
