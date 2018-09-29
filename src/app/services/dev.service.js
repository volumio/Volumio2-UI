class DevService {

  constructor($rootScope, $http, $q, env) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;

    this.env = env || 'dev';

    this.isDev().then(isDev => {
      if(isDev){
        console.log("ENV:", this.env);
      }
    });
  }

  isDev() {
    return this.$q.resolve(this.env === 'dev');
  }

}

export default DevService;