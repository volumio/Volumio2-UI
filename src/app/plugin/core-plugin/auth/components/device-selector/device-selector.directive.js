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
    this.initSocket();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.user = user;
      this.postAuthInit();
    });
  }

  initSocket() {
    this.$rootScope.$on('socket:init', () => {
      this.initSocketEvents();
    });
    this.$rootScope.$on('socket:reconnect', () => {
      this.initSocketEvents();
    });
  }

  initSocketEvents() {
    //
  }

  postAuthInit() {
    if (this.user === null) {
      return;
    }
    this.myVolumioDevicesService.getDevicesByUserId(this.user.uid).then((devices) => {
      this.devices = devices;
    }).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  enableDevice(device) {
    this.modalService.openDefaultConfirm(null, 'AUTH.DEVICE_CONFIRM_ENABLE', () => {
      var deviceObj = this.sanitizeAngularfireObject(device);
      this.socketService.emit('enableMyVolumioDevice', deviceObj);
    });
  }

  disableDevice(device) {
    this.modalService.openDefaultConfirm(null, 'AUTH.DEVICE_CONFIRM_DISABLE', () => {
      var deviceObj = this.sanitizeAngularfireObject(device);
      this.socketService.emit('disableMyVolumioDevice', deviceObj);
    });
  }

  deleteDevice(device) {
    this.modalService.openDefaultConfirm(null, 'AUTH.DEVICE_CONFIRM_DELETE', () => {
      var deviceObj = this.sanitizeAngularfireObject(device);
      this.socketService.emit('deleteMyVolumioDevice', deviceObj);
    });
  }

  sanitizeAngularfireObject(object) {
    var response = {};
    for (var key in object) {
      if (key.indexOf('$') !== 0) {
        response[key] = object[key];
      }
    }
    return response;
  }

}

export default AuthDeviceSelectorDirective;
