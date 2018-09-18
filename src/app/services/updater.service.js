class UpdaterService {
  constructor($rootScope, socketService, modalService, $timeout, $log) {
    'ngInject';
    this.socketService = socketService;
    this.modalService = modalService;
    this.$timeout = $timeout;
    this.$log = $log;

    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  openUpdateModal() {
    this.status = 'updateReady';
    this.modalService.openModal(
      'ModalUpdaterController',
      'app/components/modals/modal-updater.html',
      this.updateReady,
      'lg');
  }

  update(val) {
    if (this.updateReady.alternativeEmit) {
      this.socketService.emit(this.updateReady.alternativeEmit.message, this.updateReady.alternativeEmit.payload);
    } else {
      this.socketService.emit('update', {value: val});
    }
  }

  updateDone() {
    this.status = 'updateDone';
    this.updateDone = {
      status: 'success',
      message: 'Update succes'
    };
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('updateWaitMsg', (data) => {
      this.$log.debug('updateWaitMsg', data);
      this.modalService.closeAllModals();
      this.updateReady = data;
      setTimeout(()=>{
        this.openUpdateModal();
      }, 100);
    });
    this.socketService.on('updateReady', (data) => {
      this.$log.debug('updateReady', data);
      this.modalService.closeAllModals();
      this.updateReady = data;
      setTimeout(()=>{
        this.openUpdateModal();
      }, 100);
    });
    this.socketService.on('updateProgress', (data) => {
      this.$log.debug('updateProgress', data);
      this.status = 'updateProgress';
      this.updateProgress = data;
    });
    this.socketService.on('updateDone', (data) => {
      this.$log.debug('updateDone', data);
      this.status = 'updateDone';
      this.updateDone = data;
    });
    this.socketService.on('closeAllModals', (data) => {
      this.$log.debug('closeAllModals', data);
      this.modalService.closeAllModals();
    });
  }

  initService() {
  }
}

export default UpdaterService;
