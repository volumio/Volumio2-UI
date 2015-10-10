class ModalAlarmClockController {
  constructor($modalInstance, socketService, dataObj) {
    'ngInject';
    this.$modalInstance = $modalInstance;
    this.socketService = socketService;
    this.dataObj = dataObj;
    console.log(dataObj);
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
