class NetworkStatusPluginController {
  constructor($scope, $rootScope, socketService, mockService, $log, $translate) {
    'ngInject';
    this.socketService = socketService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$log = $log;
    this.$translate = $translate;
    //this.networkInfos = mockService.get('networkInfos');
    //this.$log.debug(this.networkInfos);
    this.init();
  }

  init() {
    this.registerListner();
    this.initService();
  }

  connectToWifi(wifi) {}

  registerListner() {
    this.socketService.on('pushInfoNetwork', (data) => {
      this.$log.debug('pushInfoNetwork', data);
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
