class ModalConfirmController {
  constructor($uibModalInstance, dataObj, $translate) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
    this.$translate = $translate;
  }

  yes() {
    this.$uibModalInstance.close();
  }

  no() {
    this.$uibModalInstance.dismiss();
  }
}

export default ModalConfirmController;
