class DevService {

  constructor($rootScope, $http, $q) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;

    this.isDevelopment = null;
  }

  isDev(){
    var checking = this.$q.defer();
    console.log(location.href);
      this.$http.get('/app/plugin/core-plugin/auth/.dev').then(() => {
        this.isDevelopment = true;
        checking.resolve(this.isDevelopment);
      }).catch(() => {
        this.isDevelopment = false;
        checking.resolve(this.isDevelopment);
      });
    return checking.promise;
  }

}

export default DevService;
