class ModalSleepController {
  constructor($modalInstance, socketService, dataObj) {
    'ngInject';
    this.$modalInstance = $modalInstance;
    this.socketService = socketService;
    this.dataObj = dataObj;
    this.showMeridian = false;

    this.sleepTime = new Date();
    this.sleepTime.setHours(0, 0);
    this.enabled = false;
    this.init();
  }

  setSleep() {
    let obj = {
      enabled: this.enabled,
      time: this.sleepTime.getHours() + ':' + this.sleepTime.getMinutes()
    };
    this.socketService.emit('setSleep', obj);
    console.log('setSleep', obj, this.sleepTime, this.enabled);
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
      console.log('pushSleep', data);
      this.enabled = data.enabled;
      if (data.time) {
        let newDate = new Date();
        newDate.setHours(...data.time.split(':'));
        this.sleepTime = newDate;
      }
    });
  }

  initService() {
    this.socketService.emit('getSleep');
  }
}

export default ModalSleepController;
