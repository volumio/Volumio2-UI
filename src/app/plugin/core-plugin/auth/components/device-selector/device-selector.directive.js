class AuthDeviceSelectorDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/plugin/core-plugin/auth/components/device-selector/device-selector.html',
      controller: AuthDeviceSelectorController,
      controllerAs: 'authDeviceSelectorController'
    };
    return directive;
  }
}

class AuthDeviceSelectorController {
  constructor($rootScope, $scope, authService, myVolumioDevicesService, modalService, socketService) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.authService = authService;
    this.myVolumioDevicesService = myVolumioDevicesService;
    this.modalService = modalService;
    this.socketService = socketService;

    this.user = null;

    this.devices = [];

    this.init();
  }

  init() {
    this.authInit();
    this.preInitSocket();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.user = user;
      this.postAuthInit();
    });
  }

  preInitSocket() {
    this.$rootScope.$on('socket:init', () => {
      this.initSocket();
    });
    this.$rootScope.$on('socket:reconnect', () => {
      this.initSocket();
    });
  }

  initSocket() {
    //
  }

  postAuthInit() {
    if (this.user === null) {
      return;
    }
    this.myVolumioDevicesService.getDevicesByUserId(this.user.uid).then((devices) => {
      this.devices = devices;
      console.log(devices);
    }).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  enableDevice(device) {
    this.modalService.openDefaultConfirm(null, 'AUTH.DEVICE_CONFIRM_ENABLE', () => {
      var device = this.sanitizeAngularfireObject(device);
      this.socketService.emit('enableMyVolumioDevice', device);
    });
  }

  disableDevice(device) {
    this.modalService.openDefaultConfirm(null, 'AUTH.DEVICE_CONFIRM_DISABLE', () => {
      var device = this.sanitizeAngularfireObject(device);
      this.socketService.emit('disableMyVolumioDevice', device);
    });
  }

  deleteDevice(device) {
    this.modalService.openDefaultConfirm(null, 'AUTH.DEVICE_CONFIRM_DELETE', () => {
      var device = this.sanitizeAngularfireObject(device);
      this.socketService.emit('deleteMyVolumioDevice', device);
    });
  }

  sanitizeAngularfireObject(object) {
    for (var key in object) {
      if (object[key].startsWith("$")) {
        delete object.key;
      }
    }
    return object;
  }

}

export default AuthDeviceSelectorDirective;
