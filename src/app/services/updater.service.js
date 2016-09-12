class UpdaterService {
  constructor($rootScope, socketService, modalService, $timeout, $log) {
    'ngInject';
    this.socketService = socketService;
    this.modalService = modalService;
    this.$timeout = $timeout;
    this.$log = $log;
    // this.updateReady =
    //   {
    //     title: 'Update v2.0',
    //     description: `- Bug fixing, new dac available<br/> - <a href="http://volumio.org/"
    //         target="_blank">http://volumio.org/</a>`,
    //     updateavailable: true,
    //     alternativeEmit: {
    //       message: 'method',
    //       payload: 'payme'
    //     }
    //   };
    // this.status = 'updateProgress';
    // this.updateProgress = {
    //   progress: 90,
    //   status: 'please wait',
    //   downloadSpeed: '100',
    //   eta: '40m 30s'
    // };
    // this.$timeout(() => {
    //   this.updateDone();
    // }, 3000000);
    // this.openUpdateModal();

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
    // this.status = 'updateProgress';
    // this.updateProgress = {
    //   progress: 90,
    //   status: 'please wait',
    //   downloadSpeed: '100',
    //   eta: '40m 30s'
    // };
    // this.$timeout(() => {
    //   this.updateDone();
    // }, 3000000);
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
    this.socketService.on('updateReady', (data) => {
      this.$log.debug('updateReady', data);
      this.updateReady = data;
      this.openUpdateModal();
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
  }

  initService() {
  }
}

export default UpdaterService;
