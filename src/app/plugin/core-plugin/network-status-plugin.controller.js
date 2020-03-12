class NetworkStatusPluginController {
  constructor($scope, $rootScope, socketService, mockService, $log, $translate, $stateParams) {
    'ngInject';
    this.socketService = socketService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$log = $log;
    this.$translate = $translate;
    this.$stateParams = $stateParams;
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
    this.socketService.on('pushInfoNetworkReload', (data) => {
      this.$log.debug('pushInfoNetworkReload', data);
      if (this.$stateParams.pluginName === 'system_controller-network') {
        window.location.reload();
      }
    });
    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushInfoNetworkReload');
    });
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
