class NetworkStatusPluginController {
  constructor (socketService) {
    'ngInject';
    this.socketService = socketService;
/*
    this.networkInfos = {
        type: 'wireless',
        ssid: 'Mare Nostrum',
        signal: 5,
        status: 'connected',
        ip: '192.168.1.12',
        speed: '100M',
        online: false
    };
*/
    this.init();
  }

  init() {
    this.registerListner();
    this.initService();
  }

  connectToWifi(wifi) {

  }

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
