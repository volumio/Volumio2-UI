class ModalSleepController {
  constructor($uibModalInstance, socketService, dataObj, $log, $translate) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.socketService = socketService;
    this.dataObj = dataObj;
    this.showMeridian = false;
    this.$log = $log;
    this.$translate = $translate;

    this.timeType = 'offset';
    this.sleepTime = new Date();
    this.sleepTime.setHours(0, 0);
    this.enabled = false;


    $translate(['SLEEP.POWER_OFF', 'SLEEP.STOP_MUSIC', 'SLEEP.IN' /*, 'SLEEP.AT' */]).then(translations => {
        this.whenSleepSelect = [
          {
            val: 'stop',
            text: translations['SLEEP.STOP_MUSIC']
          },
          {
            val: 'poweroff',
            text: translations['SLEEP.POWER_OFF']
          }
        ];
        this.whenSleepTimeTypeSelect = [
          {
            val: 'offset',
            text: translations['SLEEP.IN']
          },
          {
            val: 'absolute',
            text: translations['SLEEP.AT']
          }
        ];
      });
    this.init();
  }

  setSleep() {
    let obj = {
      timeType: this.timeType.val,
      enabled: this.enabled,
      time: this.sleepTime.getHours() + ':' + this.sleepTime.getMinutes(),
      action: this.action.val
    };
    this.socketService.emit('setSleep', obj);
    this.$log.debug('setSleep', obj, this.sleepTime, this.enabled);
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
      this.$log.debug('pushSleep', data);
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
