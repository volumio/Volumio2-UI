class ModalConfirmController {
  constructor($uibModalInstance, dataObj, $translate) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
    this.$translate = $translate;
  }

  yes() {
    this.$uibModalInstance.close('yes');
  }

  no() {
    this.$uibModalInstance.dismiss('no');
  }
}

export default ModalConfirmController;
