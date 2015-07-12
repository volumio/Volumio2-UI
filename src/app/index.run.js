function runBlock ($log, $window) {
  'ngInject';
  $log.debug('runBlock end');
  $window.socket = io('http://192.168.192.14:3000');
}

export default runBlock;
