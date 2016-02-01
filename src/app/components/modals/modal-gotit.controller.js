class ModalGotitController {
  constructor($uibModalInstance, dataObj) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
  }

  gotIt() {
    this.$uibModalInstance.close();
  }
}

export default ModalGotitController;
