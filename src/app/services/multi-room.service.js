class MultiRoomService {
  constructor($rootScope, socketService, mockService, $log) {
    'ngInject';
    this.socketService = socketService;
    this.mockService = mockService;
    this.$log = $log;
    // this.multiRoomDevices = mockService.get('multiRoomDevices');
    // this.$log.debug(this.multiRoomDevices);
    // this.devices = this.mapDevices(this.multiRoomDevices);
    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  mapDevices(devices) {
    let mappedDevices = [];
    devices.forEach((item) => {
      mappedDevices.push(item);
      if (item.child) {
        item.child.forEach((subItem) => {
          subItem.isChild = true;
          mappedDevices.push(subItem);
        });
      }
    });
    return mappedDevices;
  }

  addChild(from, to) {
    let obj = {
      ip: from.ip,
      set: 'client'
    };
    this.$log.debug('setClient', obj);
    this.socketService.emit('setMultiroom', obj);
    obj = {
      ip: to.ip,
      set: 'server'
    };
    this.$log.debug('setServer', obj);
    this.socketService.emit('setMultiroom', obj);
  }

  removeChildDevice(ip) {
    let obj = {
      ip: ip,
      set: 'single'
    };
    this.$log.debug('removeChildDevice', obj);
    this.socketService.emit('setMultiroom', obj);
  }

  changeGroupVolume(ip, volume) {
    let obj = {
      ip: ip,
      groupvolume: volume
    };
    this.$log.debug('changeGroupVolume', obj);
    this.socketService.emit('setMultiroom', obj);
  }

  changeChildVolume(ip, volume) {
    let obj = {
      ip: ip,
      volume: volume
    };
    this.$log.debug('changeChildVolume', obj);
    this.socketService.emit('setMultiroom', obj);
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushMultiRoomDevices', (data) => {
      this.$log.debug('pushMultiRoomDevices', data);
      this.devices = this.mapDevices(data.list);
    });
    this.socketService.on('pushMultiroom', (data) => {
      this.$log.debug('pushMultiRoom', data);
      this.multiRoomDevices = data;
    });
  }

  initService() {
    this.socketService.emit('getMultiRoomDevices');
    this.socketService.emit('getMultiroom');
  }

}

export default MultiRoomService;
