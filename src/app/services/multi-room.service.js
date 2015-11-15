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
