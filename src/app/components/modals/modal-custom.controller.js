class ModalCustomController {
  constructor($uibModalInstance, dataObj, socketService, $translate, $window, $state, modalService) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
    this.socketService = socketService;
    this.$translate = $translate;
    this.$window = $window;
    this.$state = $state;
    this.modalService = modalService;
  }

  ok() {
    this.$uibModalInstance.close();
  }

  cancel() {
    this.modalService.emitCloseAllModals();
    this.$uibModalInstance.dismiss();
  }

  btnClick(button) {
    if (button.emit) {
      this.socketService.emit(button.emit, button.payload);
    } else if (button.url) {
      this.$window.open(button.url, "_self");
    } else if (button.state) {
      this.$state.go(button.state);
    }
    this.$uibModalInstance.close();
  }
}

export default ModalCustomController;
