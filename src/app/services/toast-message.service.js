class ToastMessageService {
  constructor ($rootScope, socketService) {
    'ngInject';
    this.socketService = socketService;

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
  }

  showMessage(type, message, title) {
    switch (type) {
      case 'success':
        toastr.success(message, title);
        break;
      case 'info':
        toastr.info(message, title);
        break;
      case 'warning':
        toastr.warning(message, title);
        break;
      case 'error':
        toastr.error(message, title);
        break;
    }
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushToastMessage', (data) => {

    });
  }

  initService() {}

}

export default ToastMessageService;
