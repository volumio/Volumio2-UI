class ModalSleepController {
  constructor($uibModalInstance, socketService, dataObj) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.socketService = socketService;
    this.dataObj = dataObj;
    this.showMeridian = false;

    this.sleepTime = new Date();
    this.sleepTime.setHours(0, 0);
    this.enabled = false;
    this.whenSleepSelect = [
      {val: 'poweroff', text: 'Power Off'},
      {val: 'stop', text: 'Stop Music'}
    ];
    this.init();
  }

  setSleep() {
    let obj = {
      enabled: this.enabled,
      time: this.sleepTime.getHours() + ':' + this.sleepTime.getMinutes(),
      action: this.action.val
    };
    this.socketService.emit('setSleep', obj);
    console.log('setSleep', obj, this.sleepTime, this.enabled);
    this.$uibModalInstance.close();
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushSleep', (data) => {
      console.log('pushSleep', data);
      this.enabled = data.enabled;
      this.action = data.action;
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
