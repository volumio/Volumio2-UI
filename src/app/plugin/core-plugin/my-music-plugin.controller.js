class MyMusicPluginController {
  constructor($scope, socketService, mockService, $interval) {
    'ngInject';
    this.socketService = socketService;
    this.$interval = $interval;
    $scope.$on('$destroy', () => {
      if (this.intervalHandler) {
        this.$interval.cancel(this.intervalHandler);
      }
    });
    //this.myCollectionStats = mockService.get('myCollectionStats');
    this.init();
  }

  rescanLibrary() {
    this.socketService.emit('rescanDb');
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushMyCollectionStats', (data) => {
      console.log('pushMyCollectionStats', data);
      this.myCollectionStats = data;
    });
  }

  initService() {
    this.socketService.emit('getMyCollectionStats');
    this.intervalHandler = this.$interval(() => {
      this.socketService.emit('getMyCollectionStats');
    }, 4000);
  }
}

export default MyMusicPluginController;
