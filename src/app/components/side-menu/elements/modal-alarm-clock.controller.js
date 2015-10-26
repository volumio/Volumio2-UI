class ModalAlarmClockController {
  constructor($modalInstance, socketService, dataObj, playlistService) {
    'ngInject';
    this.$modalInstance = $modalInstance;
    this.socketService = socketService;
    this.dataObj = dataObj;
    this.playlistService = playlistService;

    this.init();
    this.alarms = [
      {id: 1, enabled: true, time: '', playlist: 'Mock play 1'},
      {id: 2, enabled: false, time: '', playlist: 'Mock play 2'}
    ];
  }

  save() {
    this.socketService.emit('getAlarms', this.alarms);
    this.$modalInstance.close();
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
    this.$modalInstance.dismiss('cancel');
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushAlarms', (data) => {
      console.warn('pushAlarms', data);
      //this.menuItems = data;
    });
  }

  initService() {
    this.socketService.emit('getAlarms');
  }
}

export default ModalAlarmClockController;
