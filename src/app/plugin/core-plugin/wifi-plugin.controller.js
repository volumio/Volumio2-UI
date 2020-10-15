class WifiPluginController {
  constructor($rootScope, $scope, socketService, mockService, $log, $translate, themeManager, uiSettingsService) {
    'ngInject';
    this.socketService = socketService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$log = $log;
    this.$translate = $translate;
    this.uiSettingsService = uiSettingsService;
    //this.wirelessNetworks = mockService.get('wirelessNetworks');
    this.init();
  }

  init() {
    this.registerListner();
    this.initService();
    this.securityTypes = [
      {label: 'open'},
      {label: 'wep'},
      {label: 'wpa'},
      {label: 'wpa2'}
    ];
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
      security: wifi.security.label || wifi.security,
      password: wifi.password,
      hidden: wifi.hidden
    };
    this.wirelessNetworks.available[index].insertPassword = undefined;
    this.$log.debug('connect to', wifi, saveWiFi);
    this.socketService.emit('saveWirelessNetworkSettings', saveWiFi);
  }

  connectToWifiWizard(wifi, index) {
    let saveWiFi = {
      ssid: wifi.ssid,
      security: wifi.security.label || wifi.security,
      password: wifi.password,
      hidden: wifi.hidden,
      persistentWizard: this.isPersistentWizard()
    };
    this.wirelessNetworks.available[index].insertPassword = undefined;
    this.$log.debug('connect to', wifi, saveWiFi);
    this.socketService.emit('connectWirelessNetworkWizard', saveWiFi);
  }

  cancelConnectToWifi(wifi) {
    wifi.insertPassword = undefined;
  }

  refreshWifiNetworks() {
    this.socketService.emit('getWirelessNetworks', '');
  }

  disconnectFromWiFi() {}

  addManualConnectionEntry(data) {
    // We need to make sure to add a special field at the end to signal manual connection
    data.available = data.available.filter(function(value){
      return !value.manual;
    });
    if (!data.available.slice(-1).pop().manual) {
      data.available.push({
        security: this.securityTypes[0],
        signal: -1,
        ssidHidden: true,
        manual: true
      });
    }
    return data;
  }

  registerListner() {
    this.socketService.on('pushWirelessNetworks', (data) => {
      this.$log.debug('pushWirelessNetworks', data);
      if (!this.wirelessNetworks) {
        this.wirelessNetworks = {'available' : []};
      }

      if (!data) {
        data = {'available' : []};
      }

      data.available.forEach((network) => {
        const actualNetwork = this.wirelessNetworks.available.find((n) => {
          return n.ssid === network.ssid;
        });
        if (actualNetwork !== undefined) {
          actualNetwork.security = network.security;
          actualNetwork.signal = network.signal;
        } else {
          this.wirelessNetworks.available.push(network);
        }
      });
      this.wirelessNetworks = this.addManualConnectionEntry(this.wirelessNetworks);

      this.wirelessNetworks.available.map((network) => {
        if (!network.security || network.security === '') {
          network.security = this.securityTypes[0];
          network.hotSpot = true;
        }
      });
    });
    this.socketService.on('pushWizardWirelessConnResults', (data) => {
      this.$log.debug('pushWizardWirelessConnResults', data);
      this.wirelessNetworks = '';
      this.WirelessConnResults = data;
    });
    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushWirelessNetworks');
      this.socketService.off('pushWizardWirelessConnResults');
    });
  }

  initService() {
    this.socketService.emit('getWirelessNetworks');
  }

  isPersistentWizard() {
    return this.uiSettingsService.uiSettings.persistentWizard;
  }
}

export default WifiPluginController;
