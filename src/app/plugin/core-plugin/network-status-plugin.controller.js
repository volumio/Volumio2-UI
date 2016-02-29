class NetworkStatusPluginController {
  constructor($scope, socketService, mockService) {
    'ngInject';
    this.socketService = socketService;
    this.$scope = $scope;
    //this.networkInfos = mockService.get('networkInfos');
    //console.log(this.networkInfos);
    this.init();
  }

  init() {
    this.registerListner();
    this.initService();
  }

  connectToWifi(wifi) {}

  registerListner() {
    this.socketService.on('pushInfoNetwork', (data) => {
      console.log('pushInfoNetwork', data);
      this.networkInfos = data;
    });
    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushInfoNetwork');
    });
  }

  initService() {
    this.socketService.emit('getInfoNetwork');
  }
}

export default NetworkStatusPluginController;
