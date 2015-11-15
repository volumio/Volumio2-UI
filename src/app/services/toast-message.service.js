class ToastMessageService {
  constructor($rootScope, toastr, socketService) {
    'ngInject';
    this.socketService = socketService;
    this.toastr = toastr;

    $rootScope.$on('socket:init', () => {
      this.init();
    });
  }

  showMessage(type, message, title) {
    switch (type) {
      case 'success':
        this.toastr.success(message, title);
        break;
      case 'info':
        this.toastr.info(message, title);
        break;
      case 'warning':
        this.toastr.warning(message, title);
        break;
      case 'error':
        this.toastr.error(message, title);
        break;
    }
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushToastMessage', (data) => {
      //console.log(data);
      this.showMessage(data.type, data.message, data.title);
    });
  }

  initService() {}
}

export default ToastMessageService;
