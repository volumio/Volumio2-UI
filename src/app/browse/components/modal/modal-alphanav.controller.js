class ModalAlphanavController {
  constructor(socketService, $uibModalInstance, dataObj) {
    'ngInject';
    this.socketService = socketService;
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
  }

  ok() {
    this.$uibModalInstance.close();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  alphaClick(alpha) {
    this.dataObj.browseController.scrollTo(alpha);
    this.$uibModalInstance.close();
  }
}

export default ModalAlphanavController;
