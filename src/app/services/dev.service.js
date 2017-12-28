class DevService {

  constructor($rootScope, $http, $q, env) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;

    this.isDevelopment = env || 'dev';
  }

  isDev() {
    return this.$q.resolve(this.isDevelopment === 'dev');
  }

}

export default DevService;