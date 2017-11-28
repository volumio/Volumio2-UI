class DeviceEndpointsService{

  constructor($rootScope,socketService,authService,$state,$window,$http,myVolumioDevicesService){
    this.$rootScope = $rootScope;
    this.socketService = socketService;
    this.authService = authService;
    this.$state = $state;
    this.$window = $window;
    this.$http = $http;
    this.myVolumioDevicesService = myVolumioDevicesService;

  }

  initSocket(isSocketRequired = true){
   return this.requireSocketHosts(isSocketRequired).then(hosts => {
      return this.setSocketHosts(hosts);
    }).catch(error => {
      if(error === 'NO_SOCKET_ENDPOINTS'){
        return false;
      }
      throw error;
   });
  }

  requireSocketHosts(){
    if(!this.authService.isOnCloud()){
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
        throw 'NO_SOCKET_ENDPOINTS';
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
          throw 'NO_SOCKET_ENDPOINTS';
        }
        return eligibleRemoteHosts;
      });
    });
  }

  setSocketHosts(hosts){
    const firstHostKey = Object.keys(hosts)[0];
    this.socketService.hosts = hosts;
    this.socketService.host = hosts[firstHostKey];
    return true;
  }

  checkSocketHost(){
    console.log("CHECK");
  }

}

export default DeviceEndpointsService;
