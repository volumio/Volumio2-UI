class ModalGotitController {
  constructor($modalInstance, dataObj) {
    'ngInject';
    this.$modalInstance = $modalInstance;
    this.dataObj = dataObj;
  }

  gotIt() {
    this.$modalInstance.close();
  }
}

export default ModalGotitController;
