class MultiRoomDockDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/multi-room-dock/multi-room-dock.html',
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
    this.socketService.changeHost(device.host);
  }

}

export default MultiRoomDockDirective;
