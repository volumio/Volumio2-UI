class ModalService {
  constructor($uibModal, $filter) {
    'ngInject';
    this.$uibModal = $uibModal;
    this.$filteredTranslate = $filter('translate');
  }

  openModal(controller = 'ModalController', templateUrl = 'app/components/modals/default-modal.html', dataObj = null,
          size = 'sm', backdrop = 'static') {
    let modalInstance = this.$uibModal.open({
      animation: true,
      templateUrl: templateUrl,
      controller: controller,
      controllerAs: 'modal',
      size: size,
      backdrop: backdrop,
      resolve: {
        dataObj: () => dataObj
      }
    });

    // modalInstance.result.then(function() {
    // }, function() {
    //   //this.$log.debug('Modal dismissed at: ' + new Date());
    // });
    return modalInstance;
  }

  openDefaultModal(titleLangKey, descLangKey, callback = null) {
    var params = {
      title: this.$filteredTranslate(titleLangKey),
      message: this.$filteredTranslate(descLangKey),
      disableCancelButton: true,
      callback: callback
    };
    return this.openModal(undefined, undefined, params);
  }
  
  openDefaultConfirm(titleLangKey, descLangKey, callback = null) {
    var params = {
      title: this.$filteredTranslate(titleLangKey),
      message: this.$filteredTranslate(descLangKey),
      disableCancelButton: false,
      callback: callback
    };
    return this.openModal(undefined, undefined, params);
  }

  openDefaultErrorModal(descLangKey, callback = null) {
    return this.openDefaultModal("AUTH.ERROR",descLangKey, callback);
  }

}

export default ModalService;
