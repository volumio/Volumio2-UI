class ModalSleepController {
  constructor ($modalInstance, socketService, params) {
    'ngInject';
    this.$modalInstance = $modalInstance;
    this.socketService = socketService;
    this.params = params;
    this.showMeridian = false;

    this.init();
    this.sleepTime = new Date();
    this.sleepActive = false;
  }

  setSleep() {
    let obj = {
      enabled: this.sleepActive,
      time: this.sleepTime.getHours() + ':' + this.sleepTime.getMinutes()
    };
    this.socketService.emit('setSleep', obj);
    console.log('setSleep', obj, this.sleepTime, this.sleepActive);
    this.$modalInstance.close();
  }

  cancel() {
    this.$modalInstance.dismiss('cancel');
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushSleep', (data) => {
     console.warn('pushSleep', data);
     //this.menuItems = data;
    });
  }

  initService() {
    this.socketService.emit('getSleep');
  }
}

export default ModalSleepController;
