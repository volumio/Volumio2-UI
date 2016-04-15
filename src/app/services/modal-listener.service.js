class ModalListenerService {
  constructor($rootScope, socketService, modalService, mockService, $log) {
    'ngInject';
    this.socketService = socketService;
    this.modalService = modalService;
    this.$log = $log;

    // const mockModal = mockService.get('customModals');
    // this.openModal(mockModal);

    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  openModal(data) {
    this.modalService.openModal(
      'ModalCustomController',
      'app/components/modals/modal-custom.html',
      data,
      data.size);
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('openModal', (data) => {
      this.$log.debug('openModal', data);
      this.openModal(data);
    });
  }

  initService() {
  }
}

export default ModalListenerService;
