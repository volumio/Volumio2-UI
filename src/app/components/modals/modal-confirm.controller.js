class ModalConfirmController {
  constructor($modalInstance, dataObj) {
    'ngInject';
    this.$modalInstance = $modalInstance;
    this.dataObj = dataObj;
  }

  yes() {
    this.$modalInstance.close('yes');
  }

  no() {
    this.$modalInstance.dismiss('no');
  }
}

export default ModalConfirmController;
