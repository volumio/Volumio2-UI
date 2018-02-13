class ModalSleepController {
  constructor($uibModalInstance, socketService, dataObj, $log, $translate) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.socketService = socketService;
    this.dataObj = dataObj;
    this.showMeridian = false;
    this.$log = $log;
    this.$translate = $translate;

    // defaults before translation occurs
    this.sleepPresets = [
      { text: '...', val: 0 }
    ];

    this.preset_placeholder = "Choose a preset";

    this.sleepTime = new Date();
    this.sleepTime.setHours(0, 0);
    this.enabled = false;


    $translate(['SLEEP.POWER_OFF', 'SLEEP.STOP_MUSIC', 'SLEEP.HR', 'SLEEP.MIN', 'SLEEP.OFF', 'SLEEP.CHOOSE_PRESET']).then(translations => {
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
        var hr = translations['SLEEP.HR'];
        var min = translations['SLEEP.MIN'];

        this.preset_placeholder = translations['SLEEP.CHOOSE_PRESET'];

        this.sleepPresets = [
          { text: translations['SLEEP.OFF'], val: 0 },
          { text: '15 ' + min, val: 15 },
          { text: '30 ' + min, val: 30 },
          { text: '45 ' + min, val: 45 },
          { text: '1 ' + hr, val: 60 },
          { text: '1½ ' + hr, val: 90 },
          { text: '2 ' + hr, val: 120 },
          { text: '2½ ' + hr, val: 150 },
          { text: '3 ' + hr, val: 180 },
          { text: '4 ' + hr, val: 240 }
        ];

      });
    this.init();
  }

  whenSleepPresetSelect () {
    var hours = Math.floor(this.sleepPreset.val / 60);
    var minutes = this.sleepPreset.val % 60;
    this.sleepTime = new Date(0, 0, 0, hours, minutes, 0);
    this.enabled = this.sleepPreset.val > 0;
    if (this.sleepPreset.val === 0) {
      // put back the placeholder
      this.sleepPreset = null;
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
