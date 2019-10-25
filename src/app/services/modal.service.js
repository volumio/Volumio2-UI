class ModalService {
  constructor($uibModal, socketService, $rootScope, $filter) {
    'ngInject';
    this.$uibModal = $uibModal;
	this.$filteredTranslate = $filter('translate');
    this.socketService = socketService;
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
    return this.openDefaultModal("MYVOLUMIO.ERROR", descLangKey, callback);
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
