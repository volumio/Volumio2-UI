class MultiRoomService {
  constructor($rootScope, socketService, mockService) {
    'ngInject';
    this.socketService = socketService;
    this.mockService = mockService;
    // this.multiRoomDevices = mockService.get('multiRoomDevices');
    // console.log(this.multiRoomDevices);
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
    console.log('setClient', obj);
    this.socketService.emit('setMultiroom', obj);
    obj = {
      ip: to.ip,
      set: 'server'
    };
    console.log('setServer', obj);
    this.socketService.emit('setMultiroom', obj);
  }

  removeChildDevice(ip) {
    let obj = {
      ip: ip,
      set: 'single'
    };
    console.log('removeChildDevice', obj);
    this.socketService.emit('setMultiroom', obj);
  }

  changeGroupVolume(ip, volume) {
    let obj = {
      ip: ip,
      groupvolume: volume
    };
    console.log('changeGroupVolume', obj);
    this.socketService.emit('setMultiroom', obj);
  }

  changeChildVolume(ip, volume) {
    let obj = {
      ip: ip,
      volume: volume
    };
    console.log('changeChildVolume', obj);
    this.socketService.emit('setMultiroom', obj);
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushMultiRoomDevices', (data) => {
      console.log('pushMultiRoomDevices', data);
      this.devices = this.mapDevices(data.list);
    });
    this.socketService.on('pushMultiroom', (data) => {
      console.log('pushMultiRoom', data);
      this.multiRoomDevices = data;
    });
  }

  initService() {
    this.socketService.emit('getMultiRoomDevices');
    this.socketService.emit('getMultiroom');
  }

}

export default MultiRoomService;
