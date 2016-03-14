class ModalListenerService {
  constructor($rootScope, socketService, modalService, mockService) {
    'ngInject';
    this.socketService = socketService;
    this.modalService = modalService;

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
      console.log('openModal', data);
      this.openModal(data);
    });
  }

  initService() {
  }
}

export default ModalListenerService;
