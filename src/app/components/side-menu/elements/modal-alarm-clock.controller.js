class ModalAlarmClockController {
  constructor($uibModalInstance, socketService, dataObj, playlistService, $log, $translate) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.socketService = socketService;
    this.dataObj = dataObj;
    this.playlistService = playlistService;
    this.$log = $log;
    this.$translate = $translate;

    this.init();
    // this.alarms = [
    //   {id: 1, enabled: true, time: '', playlist: 'Mock play 1'},
    //   {id: 2, enabled: false, time: '', playlist: 'Mock play 2'}
    // ];
    this.alarms = [];
  }

  save() {
    this.socketService.emit('saveAlarm', this.alarms);
    this.$uibModalInstance.close();
  }

  add() {
    this.alarms.push(
      {
        enabled: true,
        time: '',
        playlist: ''
      });
    this.$log.debug(this.alarms);
  }

  deleteAlarm(index) {
    this.alarms.splice(this.alarms.indexOf(index), 1);
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushAlarm', (data) => {
      this.alarms = data;
      //this.$log.debug('pushAlarm', data);
    });
  }

  initService() {
    this.socketService.emit('getAlarms');
  }
}

export default ModalAlarmClockController;
