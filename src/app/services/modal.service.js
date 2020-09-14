class ModalService {
  constructor($uibModal, socketService, $rootScope, $filter,  $log) {
    'ngInject';
    this.$uibModal = $uibModal;
	  this.$filteredTranslate = $filter('translate');
    this.socketService = socketService;
    this.$log = $log;
    this.openedModals = [];
    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  openModal(
    controller = 'ModalController',
    templateUrl = 'app/components/modals/default-modal.html',
    dataObj = null,
    size = 'sm',
    backdrop = 'static'
  ) {
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

    this.openedModals.push(modalInstance);
    (i => {
      modalInstance.closed.then(a => {
        this.openedModals.splice(i, 1);
      });
    })(this.openedModals.length - 1);

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

  openDefaultConfirm(titleLangKey, descLangKey, callback = null, cancelCallback = null) {
    var params = {
      title: this.$filteredTranslate(titleLangKey),
      message: this.$filteredTranslate(descLangKey),
      disableCancelButton: false,
      callback: callback,
      cancelCallback: cancelCallback
    };
    return this.openModal(undefined, undefined, params);
  }

  openDefaultErrorModal(descLangKey = '', callback = null) {
    this.$log.debug('MyVolumio error: ', descLangKey);
    if (descLangKey.constructor !== String && descLangKey.constructor === Object) {
      descLangKey = this.parseErrorObject(descLangKey);
    }
    return this.openDefaultModal(this.$filteredTranslate('MYVOLUMIO.ERROR'), descLangKey, callback);
  }

  parseErrorObject(errorObj) {
    if (errorObj.error) {
      return errorObj.error;
    } else if (errorObj.data && errorObj.data.error && errorObj.data.error.message) {
      return errorObj.data.error.message;
    } else if (errorObj.message) {
      return errorObj.message;
    } else {
      return this.$filteredTranslate('MYVOLUMIO.ERROR');
    }
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('closeAllModals', () => {
      this.closeAllModals();
    });
  }

  closeAllModals(){
    this.openedModals.forEach(modal => {
      modal.close();
    });
  }
  initService() {}
}

export default ModalService;
