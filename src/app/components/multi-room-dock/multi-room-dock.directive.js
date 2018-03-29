class MultiRoomDockDirective {
  constructor(themeManager) {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: themeManager.getHtmlPath('multi-room-dock', 'components/multi-room-dock'),
      scope: false,
      controller: MultiRoomDockController,
      controllerAs: 'multiRoomDock',
      bindToController: true
    };
    return directive;
  }
}

class MultiRoomDockController {
  constructor($rootScope, socketService, multiRoomService, themeManager) {
    'ngInject';
    this.socketService = socketService;
    this.multiRoomService = multiRoomService;
  }

  changeDevice(device) {
    if (!device.isChild && !device.isSelf) {
      this.socketService.host = device.host;
      this.socketService.emit('getUiSettings');
    }
  }
}

export default MultiRoomDockDirective;
