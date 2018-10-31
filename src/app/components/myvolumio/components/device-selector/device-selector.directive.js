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
    $http, $state, matchmediaService, databaseService, firebaseApiFunctionsService) {
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
    this.databaseService = databaseService;
    this.firebaseApiFunctionsService = firebaseApiFunctionsService;

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
    //this.socketService.emit('enableMyVolumioDevice', deviceObj);
      this.doEnableDeviceApiCall(device);
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
    return this.firebaseApiFunctionsService.doDisableDeviceApiCall(device,this.user.uid);
  }

  doEnableDeviceApiCall(device) {
    return this.firebaseApiFunctionsService.doEnableDeviceApiCall(device,this.user.uid);
  }

  deleteDevice(device) {
    this.modalService.openDefaultConfirm(null, 'MYVOLUMIO.DEVICE_CONFIRM_DELETE', () => {
      return this.firebaseApiFunctionsService.deleteDevice(device,this.user.uid);
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
    this.saveLastDevice(device).then(() => {
      this.$state.go('volumio.playback');
    }).catch(() => {
      this.$state.go('volumio.playback');
    });
  }

  saveLastDevice(device) {
    return this.authService.getUser().then(user => {
      return this.databaseService.write('users/' + user.uid + '/lastHwuuid', device.hwuuid);
    }).catch(err => { return err; });
  }

}

export default MyVolumioDeviceSelectorDirective;
