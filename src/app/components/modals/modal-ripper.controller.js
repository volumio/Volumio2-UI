class ModalRipperController {
  constructor($uibModalInstance, dataObj, ripperService, browseService) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.ripperService = ripperService;
    this.dataObj = dataObj;
    this.browseService = browseService;
  }

  startToRipCd() {
    this.ripperService.startToRipCd();
    this.$uibModalInstance.close();
    this.browseService.backHome();
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}

export default ModalRipperController;
