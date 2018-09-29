class DeviceEndpointsService {

  constructor($rootScope, socketService, $window, $http, myVolumioDevicesService, cloudService, authService, $log) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.socketService = socketService;
    this.$window = $window;
    this.$http = $http;
    this.myVolumioDevicesService = myVolumioDevicesService;
    this.cloudService = cloudService;
    this.authService = authService;
    this.$log = $log;

    this.hosts = null;
    this.cloudAutoConnectToLastHwId = true;
  }

  initSocket() {
    return this.getSocketHosts().then(hosts => {
      if (hosts === null) {
        return false;
      }
      return this.setSocketHosts(hosts);
    }).catch(error => {
      return false;
    });
  }

  getSocketHosts() {
    if (this.cloudService.isOnCloud) {
      return this.getRemoteSocketHosts();
    } else {
      return this.getLocalSocketHosts();
    }
  }

  getLocalSocketHosts() {
    let localhostApiURL = `http://${this.$window.location.hostname}/api`;
    return this.$http.get(localhostApiURL + '/host')
      .then((response) => {
        this.$log.debug('IP from API', response);
        this.$rootScope.initConfig = response.data;
        const hosts = response.data;
        return hosts;
      }, () => {
        //Fallback socket
        this.$log.debug('Dev mode: IP from local-config.json');
        return this.$http.get('/app/local-config.json').then((response) => {
          const hosts = { 'devHost': response.data.localhost };
          return hosts;
        });
      });
  }

  getRemoteSocketHosts() {
    return this.authService.waitForDbUser().then(user => {
      if (user === null) {
        return null;
      }

      let lastHwuuid = null;
      if ('lastHwuuid' in user) {
        lastHwuuid = user.lastHwuuid;
      }

      return this.myVolumioDevicesService.getDevicesByUserId(user.uid).then(devices => {
        let eligibleRemoteHosts = [];
        let geoServer = user.geoServer || 'eu1';
        for (var i in devices) {
          let device = devices[i];
          if (device.enabled === true && device.online === true) {
            let deviceHwuuid = device.hwuuid;
            let remoteDeviceHost = `https://${deviceHwuuid}.${geoServer}.myvolumio.org`;
            if (lastHwuuid === deviceHwuuid) {
              eligibleRemoteHosts.unshift(`https://${deviceHwuuid}.${geoServer}.myvolumio.org`);
            } else {
              eligibleRemoteHosts.push(remoteDeviceHost);
            }
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

  setSocketHosts(hosts) {
    this.hosts = hosts;
    this.socketService.hosts = hosts;
    if (!this.cloudService.isOnCloud || (this.cloudService.isOnCloud && this.cloudAutoConnectToLastHwId)) {
      const firstHostKey = Object.keys(hosts)[0];
      this.socketService.host = hosts[firstHostKey];
    }
    return true;
  }

  isSocketAvalaible() {
    return this.hosts !== null;
  }

  setCloudAutoConnectValue(value) {
    this.cloudAutoConnectToLastHwId = value;
  }

}

export default DeviceEndpointsService;
