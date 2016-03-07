class ModalRipperController {
  constructor($uibModalInstance, dataObj, ripperService) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.ripperService = ripperService;
    this.dataObj = dataObj;
  }

  startToRipCd() {
    this.ripperService.startToRipCd();
    this.$uibModalInstance.close();
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}

export default ModalRipperController;
