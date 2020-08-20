class DevService {

  constructor($rootScope, $http, $q, env) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;

    this.DEV_ENV = 'development';
    this.PROD_ENV = 'production';
    this.env = env || this.DEV_ENV;

    if(this.isDevSync()){
      console.log("ENV:", this.env);
    }
  }

  isDev() {
    return this.$q.resolve(this.env === this.DEV_ENV);
  }

  isDevSync(){
    return this.env === this.DEV_ENV;
  }

}

export default DevService;