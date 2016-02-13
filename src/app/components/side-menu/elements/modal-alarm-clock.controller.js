class ModalAlarmClockController {
  constructor($uibModalInstance, socketService, dataObj, playlistService) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.socketService = socketService;
    this.dataObj = dataObj;
    this.playlistService = playlistService;

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
    console.log(this.alarms);
  }

  deleteAlarm(index) {
    this.alarms.splice(index, 1);
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushAlarm', (data) => {
      console.warn('pushAlarm', data);
      //this.menuItems = data;
    });
  }

  initService() {
    this.socketService.emit('getAlarms');
  }
}

export default ModalAlarmClockController;
