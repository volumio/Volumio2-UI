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
      paramsObject = this.getParametersFromQueryString(queryParamsString);
    }
    this.$log.debug('Redirecting to state: ' + state + ', params: ' + paramsObject);
    this.$state.go(state, paramsObject);
  }

  urlGo(url, queryParamsString) {
    var queryParams = '';
    if (queryParamsString) {
      queryParams = '?' + queryParamsString;
    }
    this.$log.debug('Redirecting to url: ' + url + ', params: ' + queryParams);
    var redirectUrl = '/' + url + queryParams;
    this.$window.location.href = redirectUrl;
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
