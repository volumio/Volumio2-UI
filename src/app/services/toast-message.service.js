class ToastMessageService {
  constructor ($rootScope, toastr, socketService, $log) {
    'ngInject';
    this.socketService = socketService;
    this.toastr = toastr;
    this.$log = $log;
    this.toastrDefaultConfig = {
      timeOut: 5000,
      extendedTimeOut: 1000,
      progressBar: true,
      maxOpened: 1,
      autoDismiss: true
    };

    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  showMessage (type, message, title) {
    switch (type) {
      case 'success':
        this.toastr.success(message, title, this.toastrDefaultConfig);
        break;
      case 'info':
        this.toastr.info(message, title, this.toastrDefaultConfig);
        break;
      case 'warning':
        this.toastr.warning(message, title, this.toastrDefaultConfig);
        break;
      case 'error':
        this.toastr.error(message, title, this.toastrDefaultConfig);
        break;
      case 'stickyerror':
        this.toastr.error(message, title, {closeButton: true});
        break;
    }
  }

  init () {
    this.registerListner();
    this.initService();
  }

  registerListner () {
    this.socketService.on('pushToastMessage', (data) => {
      // this.$log.debug('pushToastMessage', data);
      this.showMessage(data.type, data.message, data.title);
    });
  }

  initService () {}
}

export default ToastMessageService;
