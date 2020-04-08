class RedirectService {

  constructor($rootScope, $http, $window, $state, $location, $log) {
    'ngInject';

    this.$rootScope = $rootScope;
    this.$http = $http;
    this.$state = $state;
    this.$window = $window;
    this.$location = $location;
    this.$log = $log;
  }

  stateGo(state, queryParamsString) {
    var paramsObject = {};
    if (queryParamsString) {
      var paramsObject = this.getParametersFromQueryString(queryParamsString);
    }
    this.$log.debug('Redirecting to state: ' + state + ', params: ' + paramsObject);
    this.$state.go(state, paramsObject);
  }

  getParametersFromQueryString(queryParamsString) {
    var queryObject = {};
    try {
      var queryObject = JSON.parse('{"' + queryParamsString.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value); });
    } catch(e) {}
    return queryObject;
  }
}

export default RedirectService;
