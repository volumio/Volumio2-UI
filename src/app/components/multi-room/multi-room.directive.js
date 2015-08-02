class MultiRoomDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/multi-room/multi-room.html',
      scope: false,
      controller: MultiRoomController,
      controllerAs: 'multiRoom',
      bindToController: true
    };

    return directive;
  }
}

class MultiRoomController {
  constructor ($rootScope, socketService, mockService) {
    'ngInject';
    this.socketService = socketService;
    this.devices = mockService.get('getMultiRoomDevices');

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
  }

  changeDevice(device) {
    this.socketService.changeHost(device.host);
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushMultiRoomDevices', (data) => {
     //console.log(data);
     //this.devices = data;
    });
  }

  initService() {
    this.socketService.emit('getMultiRoomDevices');
  }
}

export default MultiRoomDirective;
