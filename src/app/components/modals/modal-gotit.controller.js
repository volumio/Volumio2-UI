class ModalGotitController {
  constructor($uibModalInstance, dataObj, $translate) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
    this.$translate = $translate;
  }

  gotIt() {
    this.$uibModalInstance.close();
  }
}

export default ModalGotitController;
