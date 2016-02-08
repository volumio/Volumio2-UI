class SystemVersionPluginController {
  constructor($scope, socketService) {
    'ngInject';
    this.socketService = socketService;
    this.$scope = $scope;
    this.init();
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushSystemVersion', (data) => {
      console.log('pushSystemVersion', data);
      this.systemVersion = data;
    });
    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushSystemVersion');
    });
  }

  initService() {
    this.socketService.emit('getSystemVersion');
  }
}

export default SystemVersionPluginController;
