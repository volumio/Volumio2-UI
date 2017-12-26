class ModalSleepController {
  constructor($uibModalInstance, socketService, dataObj, $log, $translate) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.socketService = socketService;
    this.dataObj = dataObj;
    this.showMeridian = false;
    this.$log = $log;
    this.$translate = $translate;


    this.sleepPresets = [ 0, 15, 30, 45, 60, 90, 120 ];

    this.sleepTime = new Date();
    this.sleepTime.setHours(0, 0);
    this.enabled = false;


    $translate(['SLEEP.POWER_OFF', 'SLEEP.STOP_MUSIC']).then(translations => {
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
      });
    this.init();
  }

  whenSleepPresetSelect () {
    var preset;

    if (this.sleepPreset >= 0 && this.sleepPreset < this.sleepPresets.length) {
      var preset = this.sleepPresets[this.sleepPreset];
      var hours = Math.floor(preset/60);
      var minutes = preset % 60;

      this.sleepTime = new Date(0, 0, 0, hours, minutes, 0);
    }
  }

  timeChanged()  {
    var duration = (this.sleepTime.getHours() * 60) + this.sleepTime.getMinutes();

    for (var idx = 0; idx < this.sleepPresets.length; idx++) {
      if (duration === this.sleepPresets[idx]) {
        this.sleepPreset = idx;
        return;
      }
    }

    this.sleepPreset = null;
  }

  setSleep() {
    let obj = {
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
