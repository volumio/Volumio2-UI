class SystemVersionPluginController {
  constructor(socketService) {
    'ngInject';
    this.socketService = socketService;
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
  }

  initService() {
    this.socketService.emit('getSystemVersion');
  }
}

export default SystemVersionPluginController;
