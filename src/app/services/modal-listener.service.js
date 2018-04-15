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

  openModalProgress(data) {
    this.modalService.openModal(
      'ModalProgressCustomController',
      'app/components/modals/modal-progress.html',
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
      if (data.progress) {
        this.openModalProgress(data);
        this.registerModalUpdateListner();
      } else {
        this.openModal(data);
      }

    });
  }


  registerModalUpdateListner() {
    this.socketService.on('modalProgress', (data) => {
      this.$log.debug('modalProgress', data);
      this.modalService.status = 'modalProgress';
      this.modalService.modalProgress = data;
    });
    this.socketService.on('modalDone', (data) => {
      this.$log.debug('modalDone', data);
      this.modalService.status = 'modalDone';
      this.modalService.modalProgress = data;
    });
  }

  initService() {
  }
}

export default ModalListenerService;
