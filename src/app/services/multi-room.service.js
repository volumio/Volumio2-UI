class MultiRoomService {
  constructor ($rootScope, socketService, mockService) {
    'ngInject';
    this.socketService = socketService;
    this._devices = [];
    this.mockService = mockService;

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
  }

  get devices() {
    return this._devices;
  }

  set devices(devices) {
    this._devices = devices;
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushMultiRoomDevices', (data) => {
     //console.log('pushMultiRoomDevices', data);
     let devicesMock = this.mockService.get('getMultiRoomDevices');
     data.list = data.list.concat(devicesMock.list)
     this.devices = data;
    });
  }

  initService() {
    this.socketService.emit('getMultiRoomDevices');
  }

}

export default MultiRoomService;
