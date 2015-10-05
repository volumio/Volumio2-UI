class MultiRoomDockDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/themes/volumio/components/multi-room-dock/volumio-multi-room-dock.html',
      scope: false,
      controller: MultiRoomDockController,
      controllerAs: 'multiRoomDock',
      bindToController: true
    };

    return directive;
  }
}

class MultiRoomDockController {
  constructor ($rootScope, socketService, multiRoomService) {
    'ngInject';
    this.socketService = socketService;
    this.multiRoomService = multiRoomService;
  }

  changeDevice(device) {
    if (!device.isChild) {
      this.socketService.changeHost(device.host);
    }
  }
}

export default MultiRoomDockDirective;
