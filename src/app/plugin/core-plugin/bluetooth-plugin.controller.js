class BluetoothPluginController {
  constructor($scope, socketService, mockService, $log, $translate, $interval) {
    'ngInject';
    this.socketService = socketService;
    this.$scope = $scope;
    this.$log = $log;
    this.$translate = $translate;
    this.$interval = $interval;
    this.init();
  }

  init() {
    this.registerListner();
    this.initService();
  }

  startScan() {
    this.socketService.emit('callMethod', {
      "endpoint" : "audio_interface/bluetooth_controller",
      "method" : "startScan",
      "data" : {}
    });
  }

  refreshBluetoothDevices() {
    this.socketService.emit('callMethod', {
      "endpoint" : "audio_interface/bluetooth_controller", 
      "method" : "getBluetoothDevices",
      "data" : {}
    });
  }

  registerListner() {
    this.socketService.on('pushBluetoothDevices', (data) => {
      this.$log.debug('pushBluetoothDevices', data);
      this.bluetooth = data;
    });
    this.$scope.$on('$destroy', () => {
      this.socketService.off('pushBluetoothDevices');
    });
  }

  initService() {
    this.startScan();
    this.$interval( () => { this.refreshBluetoothDevices(); }, 5000);
  }

  connectDevice(mac) {
    this.socketService.emit("callMethod", {
      "endpoint" : "audio_interface/bluetooth_controller", 
      "method" : "connectBluetoothDevice",
      "data" : {mac}
    });
  }

  disconnectDevice(mac) {
    this.socketService.emit("callMethod", {
      "endpoint" : "audio_interface/bluetooth_controller", 
      "method" : "disconnectBluetoothDevice",
      "data" : {mac}
    }); 
  }
}

export default BluetoothPluginController;
