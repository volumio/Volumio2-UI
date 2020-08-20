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
  constructor(
    $scope,
    socketService,
    multiRoomService,
    themeManager,
    authService,
    myVolumioDevicesService,
    cloudService
  ) {
    'ngInject';
    this.socketService = socketService;
    this.multiRoomServiceLocal = multiRoomService;
    this.$scope = $scope;
    this.myVolumioDevicesService = myVolumioDevicesService;
    this.authService = authService;
    this.cloudService = cloudService;
    this.init();
  }

  init() {
    if (this.cloudService.isOnCloud) {
      const watcherHandler = this.$scope.$watch(() => this.authService.user, user => {
        if (user) {
          this.myVolumioDevicesService.getDevicesByUserId(user.uid).then(devices => {
            this.multiRoomService = {
              devices
            };
          });
        }
      });

      this.$scope.$on('$destroy', () => {
        watcherHandler();
      });
    } else {
      this.multiRoomService = this.multiRoomServiceLocal;
    }
  }

  changeDevice(device) {
    if (!device.isChild && !device.isSelf) {
      this.socketService.host = device.host;
      // Disabled because it was breaking device change
      //this.socketService.emit('getUiSettings');
    }
  }

  showDevice(device) {
    if(this.cloudService && this.cloudService.isOnCloud) {
      return device.enabled && device.online;
    }
    return true;
  }
}

export default MultiRoomDockDirective;
