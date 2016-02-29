class ModalConfirmController {
  constructor($uibModalInstance, dataObj) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
  }

  yes() {
    this.$uibModalInstance.close('yes');
  }

  no() {
    this.$uibModalInstance.dismiss('no');
  }
}

export default ModalConfirmController;
