class MyVolumioDeviceSelectorDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/myvolumio/components/device-selector/device-selector.html',
      controller: MyVolumioDeviceSelectorController,
      controllerAs: 'myVolumioDeviceSelectorController'
    };
    return directive;
  }
}

class MyVolumioDeviceSelectorController {
  constructor($rootScope, $scope, authService, myVolumioDevicesService, modalService, socketService, productsService,
    $http, $state, matchmediaService) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.authService = authService;
    this.myVolumioDevicesService = myVolumioDevicesService;
    this.modalService = modalService;
    this.socketService = socketService;
    this.productsService = productsService;
    this.$http = $http;
    this.$state = $state;
    this.matchmediaService = matchmediaService;

    this.user = null;
    this.product = {};

    this.devices = [];

    this.isPhone = matchmediaService.isPhone;

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
    if (!this.socketService.isSocketAvalaible) {
      return;
    }
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
    this.initProduct();
    this.myVolumioDevicesService.getDevicesByUserId(this.user.uid).then((devices) => {
      this.devices = devices;
    }).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  initProduct() {
    this.productsService.getProductForUser(this.user).then(product => {
      this.product = product;
    });
  }

  enableDevice(device) {
    this.modalService.openDefaultConfirm(null, 'MYVOLUMIO.DEVICE_CONFIRM_ENABLE', () => {
      var maxDevices = this.product.maxDevices || 1;
      var currentActiveDevices = this.getCurrentActiveDevices();
      if (device.enabled === true) {
        currentActiveDevices--;
      }
      if (currentActiveDevices >= maxDevices) {
        this.modalService.openDefaultConfirm('MYVOLUMIO.MAX_DEVICES_ALERT_TITLE', 'MYVOLUMIO.MAX_DEVICES_ALERT_DESCRIPTION',
          () => { this.doEnableDevice(device); },
          () => { device.enabled = false; }
        );
        return;
      }
      this.doEnableDevice(device);
    }, () => { device.enabled = false; });
  }

  doEnableDevice(device) {
    var deviceObj = this.sanitizeAngularfireObject(device);
    console.log("doEnableDevice", deviceObj);
    this.socketService.emit('enableMyVolumioDevice', deviceObj);
  }

  getCurrentActiveDevices() {
    var activeDevices = 0;
    for (var k in this.devices) {
      if (this.devices[k].enabled === true) {
        activeDevices++;
      }
    }
    return activeDevices;
  }

  disableDevice(device) {
    this.modalService.openDefaultConfirm(null, 'MYVOLUMIO.DEVICE_CONFIRM_DISABLE', () => {
      //      var deviceObj = this.sanitizeAngularfireObject(device);
      //      this.socketService.emit('disableMyVolumioDevice', deviceObj);
      this.doDisableDeviceApiCall(device);
    }, () => {
      device.enabled = true;
    });
  }

  doDisableDeviceApiCall(device) {
    console.log("doDisableDevice", device);
    return this.authService.getUserToken().then(token => {
      return this.$http({
        url: 'https://us-central1-myvolumio.cloudfunctions.net/api/v1/disableMyVolumioDevice',
        method: "POST",
        params: { token: token, uid: this.user.uid, hwuuid: device.hwuuid }
      }).then(response => {
        return response.data;
      });
    });
  }

  deleteDevice(device) {
    this.modalService.openDefaultConfirm(null, 'MYVOLUMIO.DEVICE_CONFIRM_DELETE', () => {
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

  toggleAbilitation(device) {
    if (device.enabled) {
      this.disableDevice(device);
    } else {
      this.enableDevice(device);
    }
  }

  toggleAbilitationAfterChange(device) {
    if (device.enabled) {
      this.enableDevice(device);
    } else {
      this.disableDevice(device);
    }
  }

  gotoDevice(device) {
    this.socketService.host = device.host;
    this.$state.go('volumio.playback');
  }

}

export default MyVolumioDeviceSelectorDirective;
