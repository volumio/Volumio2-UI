class DeviceEndpointsService{

  constructor($rootScope,socketService,$state,$window,$http,myVolumioDevicesService, cloudService, authService){
    this.$rootScope = $rootScope;
    this.socketService = socketService;
    this.$state = $state;
    this.$window = $window;
    this.$http = $http;
    this.myVolumioDevicesService = myVolumioDevicesService;
    this.cloudService = cloudService;
    this.authService = authService;

    this.hosts = null;
  }

  initSocket(){
    return this.getSocketHosts().then(hosts => {
      console.log("HOSTS");
      console.log(hosts);
      if(hosts === null){
        console.log("Return false");
        return false;
      }
      return this.setSocketHosts(hosts);
    }).catch(error => {
      console.log("ERROR");
      console.log(error);
      return false;
    });
  }

  getSocketHosts(){
    if(!this.cloudService.isOnCloud){
      return this.getLocalSocketHosts();
    }
    return this.getRemoteSocketHosts();
  }

  getLocalSocketHosts(){
    let localhostApiURL = `http://${this.$window.location.hostname}/api`;
    return this.$http.get(localhostApiURL + '/host')
      .then((response) => {
        console.info('IP from API', response);
        this.$rootScope.initConfig = response.data;
        const hosts = response.data;
        return hosts;
      }, () => {
        //Fallback socket
        console.info('Dev mode: IP from local-config.json');
        return this.$http.get('/app/local-config.json').then((response) => {
          const hosts = {'devHost': response.data.localhost};
          return hosts;
        });
      });
  }

  getRemoteSocketHosts() {
    return this.authService.waitForDbUser().then(user => {
      if (user === null) {
        console.log("USER IS NULL");
        return null;
      }

      //TODO ADD IF ENABLED AND ONLINE
      if ('lastHwuuid' in user) {
        let lastHwuuid = user.lastHwuuid;
        let geoServer = user.geoServer || 'eu1';
        let remoteDeviceHost = `https://${lastHwuuid}.${geoServer}.myvolumio.org`;
        return [remoteDeviceHost];
      }

      return this.myVolumioDevicesService.getDevicesByUserId(user.uid).then(devices => {
        console.log("getDevicesByUserId");
        let eligibleRemoteHosts = [];
        let geoServer = user.geoServer || 'eu1';
        for (var i in devices) {
          let device = devices[i];
          if (device.enabled === true && device.online === true) {
            let deviceHwuuid = device.hwuuid;
            let remoteDeviceHost = `https://${deviceHwuuid}.${geoServer}.myvolumio.org`;
            eligibleRemoteHosts.push(remoteDeviceHost);
          }
        }
        //TODO GET FIRST ITEM BY DATE OR OTHER PARAM
        if (eligibleRemoteHosts.length === 0) {
          return null;
        }
        return eligibleRemoteHosts;
      });
    });
  }

  setSocketHosts(hosts){
    const firstHostKey = Object.keys(hosts)[0];
    this.hosts = hosts;
    this.socketService.hosts = hosts;
    this.socketService.host = hosts[firstHostKey];
    return true;
  }

  isSocketAvalaible(){
    return this.hosts !== null;
  }

}

export default DeviceEndpointsService;
