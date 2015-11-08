class ModalController {
  constructor ($modalInstance, dataObj) {
    'ngInject';
    this.$modalInstance = $modalInstance;
    this.dataObj = dataObj;
  }

  ok() {
    this.$modalInstance.close();
  }

  cancel() {
    this.$modalInstance.dismiss('cancel');
  }
}

export default ModalController;
