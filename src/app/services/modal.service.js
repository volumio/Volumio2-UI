class ModalService {
  constructor($uibModal, socketService, $rootScope) {
    'ngInject';
    this.$uibModal = $uibModal;
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

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('closeAllModals', () => {
      this.openedModals.forEach(modal => {
        modal.close();
      });
    });
  }

  initService() {}
}

export default ModalService;
