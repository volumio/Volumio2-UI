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
  constructor($rootScope, $scope, authService, myVolumioDevicesService, modalService, socketService, productsService, $http) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.authService = authService;
    this.myVolumioDevicesService = myVolumioDevicesService;
    this.modalService = modalService;
    this.socketService = socketService;
    this.productsService = productsService;
    this.$http = $http;

    this.user = null;
    this.product = {};

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
    this.initProduct();
    this.myVolumioDevicesService.getDevicesByUserId(this.user.uid).then((devices) => {
      this.devices = devices;
    }).catch(error => {
      this.modalService.openDefaultErrorModal(error);
    });
  }

  initProduct(){
    this.product = this.productsService.getProductForUser(this.user);
  }

  enableDevice(device) {
    this.modalService.openDefaultConfirm(null, 'AUTH.DEVICE_CONFIRM_ENABLE', () => {
      var maxDevices = this.product.maxDevices || 1;
      var currentActiveDevices = this.getCurrentActiveDevices();
      if(currentActiveDevices >= maxDevices){
        this.modalService.openDefaultConfirm('AUTH.MAX_DEVICES_ALERT_TITLE','AUTH.MAX_DEVICES_ALERT_DESCRIPTION',() => {
          this.doEnableDevice(device);
        });
        return;
      }
      this.doEnableDevice(device);
    });
  }

  doEnableDevice(device){
    var deviceObj = this.sanitizeAngularfireObject(device);
    this.socketService.emit('enableMyVolumioDevice', deviceObj);
  }

  getCurrentActiveDevices(){
    var activeDevices = 0;
    for(var k in this.devices){
      if(this.devices[k].enabled === true){
        activeDevices++;
      }
    }
    return activeDevices;
  }

  disableDevice(device) {
    this.modalService.openDefaultConfirm(null, 'AUTH.DEVICE_CONFIRM_DISABLE', () => {
//      var deviceObj = this.sanitizeAngularfireObject(device);
//      this.socketService.emit('disableMyVolumioDevice', deviceObj);
      this.doDisableDeviceApiCall(device);
    });
  }

  doDisableDeviceApiCall(device){
    this.authService.getUserToken().then(token => {
      this.$http({
        url: 'https://us-central1-myvolumio.cloudfunctions.net/api/v1/disableMyVolumioDevice',
        method: "POST",
        params: {token: token, uid: this.user.uid, hwuuid: device.hwuuid}
      }).then(response => {
        return response.data;
      });
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
