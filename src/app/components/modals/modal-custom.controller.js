class ModalCustomController {
  constructor($uibModalInstance, dataObj, socketService, $translate, $window) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
    this.socketService = socketService;
    this.$translate = $translate;
    this.$window = $window;
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
    } else if (button.url) {
      this.$window.open(button.url, "_self");
    }
    this.$uibModalInstance.close();
  }
}

export default ModalCustomController;
