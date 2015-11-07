class WifiPluginController {
  constructor (socketService) {
    'ngInject';
    this.socketService = socketService;
    /*this.wirelessNetworks = {
      connectedTo: {
          signal: 5,
          encryption: 'wpa2',
          ssid: 'Mare Nostrum'
      },
      available: [{
          signal: 5,
          encryption: 'wpa2',
          ssid: 'miarete1'
      }, {
          signal: 4,
          encryption: 'wpa2',
          ssid: 'AUAUAUA'
      }, {
          signal: 3,
          encryption: 'wep',
          ssid: 'Speck'
      }, {
          signal: 2,
          encryption: 'open',
          ssid: 'asd'
      }, {
          signal: 1,
          encryption: 'open',
          ssid: 'ASD'
      }]
    };*/

    this.init();
  }

  init() {
    this.registerListner();
    this.initService();
  }

  insertPassword(index) {
    this.wirelessNetworks.available.forEach((item, i) => {
      if (i !== index) {
        this.wirelessNetworks.available[i].insertPassword = undefined;
      } else {
        this.wirelessNetworks.available[i].insertPassword = true;
      }
    });
  }

  connectToWifi(wifi, index) {
    let saveWiFi = {
      ssid: wifi.ssid,
      encryption: wifi.encryption,
      password: wifi.password
    };
    this.wirelessNetworks.available[index].insertPassword = undefined;
    console.log('connect to', wifi, saveWiFi);
    this.socketService.emit('saveWirelessNetworkSettings', saveWiFi);
  }

  disconnectFromWiFi() {

  }

  registerListner() {
    this.socketService.on('pushWirelessNetworks', (data) => {
     console.log('pushWirelessNetworks', data);
     this.wirelessNetworks = data;
    });
  }

  initService() {
    this.socketService.emit('getWirelessNetworks');
  }
}

export default WifiPluginController;
