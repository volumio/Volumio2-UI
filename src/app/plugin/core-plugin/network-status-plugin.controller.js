class NetworkStatusPluginController {
  constructor(socketService, mockService) {
    'ngInject';
    this.socketService = socketService;
    // this.networkInfos = mockService.get('networkInfos');
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
  }

  initService() {
    this.socketService.emit('getInfoNetwork');
  }
}

export default NetworkStatusPluginController;
