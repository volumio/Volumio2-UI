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

  //set CurrentRemoteDeviceHostByUserId

  getDevicesByUserId(uid){
    return this.databaseService.getArray(`/${this.USER_DEVICES_REF}/${uid}`);
  }

}

export default MyVolumioDevicesService;
