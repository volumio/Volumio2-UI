class ModalCryptoController {
  constructor($uibModalInstance, dataObj, $translate) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.dataObj = dataObj;
    this.$translate = $translate;
  }

  close() {
    this.$uibModalInstance.close();
  }

}

export default ModalCryptoController;
