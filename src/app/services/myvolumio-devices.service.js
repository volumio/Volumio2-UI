class MyVolumioDevicesService {
  constructor($rootScope, $q, authService, databaseService) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.authService = authService;
    this.databaseService = databaseService;

    this.USER_DEVICES_REF = 'user_devices';
    this.USER_REF = 'users';

    this.init();
  }

  init() {
    //this.authInit();
  }

  authInit() {
    this.$scope.$watch(() => this.authService.user, (user) => {
      this.user = user;
    });
  }

  getCurrentRemoteDeviceHost(){
    return this.authService.getUser().then(user => {
      if(user === null){
        let getting = this.$q.defer();
        getting.resolve(null);
        return getting.promise;
      }
      console.log("getCurrentRemoteDeviceHost");
      console.log(user);
      //TODO ADD IF ENABLED AND ONLINE
      if('lastHwuuid' in user) {
        let lastHwuuid = user.lastHwuuid;
        let geoServer = user.geoServer || 'eu1';
        let remoteDeviceHost = `https://${lastHwuuid}.${geoServer}.myvolumio.org`;
        let getting = this.$q.defer();
        getting.resolve(remoteDeviceHost);
        return getting.promise;
      }else {
        return this.getDevicesByUserId(user.uid).then(devices => {
          console.log("getDevicesByUserId");
          let eligibleDevices = [];
          for (var i in devices) {
            let device = devices[i];
            if (device.enabled === true && device.online === true) {
              eligibleDevices.push(device);
            }
          }
          //TODO GET FIRST ITEM BY DATE OR OTHER PARAM
          if (eligibleDevices.length === 0) {
            let getting = this.$q.defer();
            getting.reject("MYVOLUMIO_NO_ALIVE_DEVICES");
            return getting.promise;
          }
          let lastHwuuid = eligibleDevices[0].hwuuid;
          let geoServer = user.geoServer || 'eu1';
          let remoteDeviceHost = `https://${lastHwuuid}.${geoServer}.myvolumio.org`;
          let getting = this.$q.defer();
          getting.resolve(remoteDeviceHost);
          return getting.promise;
        });
      }
    });
  }

  //set CurrentRemoteDeviceHostByUserId

  getDevicesByUserId(uid){
    return this.databaseService.getArray(`/${this.USER_DEVICES_REF}/${uid}`);
  }

}

export default MyVolumioDevicesService;
