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

  requireSocketHost($state){
    console.log("INIT RESOLVE");
    console.log($state);
    if(this.authService.isOnCloud()){
      console.log("IS ON CLOUD");
      return this.authService.waitForDbUser().then(user => {
        console.log("waitForDbUser then ");
        console.log(user);
        if(user === null){
          console.log("FLOW 1");
          this.$state.go('myvolumio.login');
          return true;
        }else{
          //TODO CHECK IF VIRTUOSO OR UPPER
          //TODO CONNECT WITH THE VALID REMOTE DEVICE (Last)
          console.log("FLOW 2");

          return this.myVolumioDevicesService.getCurrentRemoteDeviceHost().then(host => {
            console.log("REMOTE DEVICE HOST");
            console.log(host);
            if(host === null || host === undefined){
              //this.$state.go('myvolumio.login');
              return true;
            }
            this.socketService.host = host;
            return true;
          });

        }
      });
    } else {
      let localhostApiURL = `http://${this.$window.location.hostname}/api`;
      return this.$http.get(localhostApiURL + '/host')
        .then((response) => {
          console.info('IP from API', response);
          this.$rootScope.initConfig = response.data;
          const hosts = response.data;
          const firstHostKey = Object.keys(hosts)[0];
          this.socketService.hosts = hosts;
          this.socketService.host = hosts[firstHostKey];
        }, () => {
          //Fallback socket
          console.info('Dev mode: IP from local-config.json');
          return this.$http.get('/app/local-config.json').then((response) => {
            // const hosts = {
            //   'host1': 'http://192.168.0.65',
            //   'host2': 'http://192.168.0.66',
            //   'host3': 'http://192.168.0.67'};
            const hosts = {'devHost': response.data.localhost};
            const firstHostKey = Object.keys(hosts)[0];
            this.socketService.hosts = hosts;
            this.socketService.host = hosts[firstHostKey];
          });
        });
    }
  }

  checkSocketHost(){
    console.log("CHECK");
  }

}

export default DeviceEndpointsService;
