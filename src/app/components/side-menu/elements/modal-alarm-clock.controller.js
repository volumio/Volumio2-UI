class ModalAlarmClockController {
  constructor ($modalInstance, socketService, params) {
    'ngInject';
    this.$modalInstance = $modalInstance;
    this.socketService = socketService;
    this.params = params;
    console.log(params);
    this.init();
  }

  cancel() {
    this.$modalInstance.dismiss('cancel');
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    // this.socketService.on('pushSleep', (data) => {
    //  console.warn('pushSleep', data);
    //  //this.menuItems = data;
    // });
  }

  initService() {
    //this.socketService.emit('getSleep');
  }
}

export default ModalAlarmClockController;
