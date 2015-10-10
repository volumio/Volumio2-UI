class UpdaterService {
  constructor($rootScope, socketService, modalService, $timeout) {
    'ngInject';
    this.socketService = socketService;
    this.modalService = modalService;
    this.$timeout = $timeout;

    //this.updateReady();


    $rootScope.$on('socket:init', () => {
      this.init();
    });
  }

  updateReady() {
    this.status = 'updateReady';
    this.modalService.openModal(
      'ModalUpdaterController',
      'app/components/modal-updater/modal-updater.html',
      {
        title: 'Update v2.0',
        description: '- Bug fixing, new dac available<br/> - <a href="http://volumio.org/" target="_blank">http://volumio.org/</a>'
      },
      'lg');
  }

  update(val) {
    this.status = 'updateProgress';
    this.socketService.emit('update', {value: val});

    this.updateProgress = {
      progress: 90,
      status: 'please wait',
      downloadSpeed: '100',
      eta: '40m 30s'
    };

    this.$timeout(() => {
      this.updateDone();
    }, 3000);
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
      console.log('updateReady', data);
      this.updateReady = data;
    });
    this.socketService.on('updateProgress', (data) => {
      console.log('updateProgress', data);
      this.status = 'updateProgress';
      this.updateProgress = data;
    });
    this.socketService.on('updateDone', (data) => {
      console.log('updateDone', data);
      this.updateDone = data;
    });
  }

  initService() {
  }
}

export default UpdaterService;
