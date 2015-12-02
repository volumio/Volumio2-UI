class LoggerService {
  constructor($rootScope, $log, socketService) {
    'ngInject';
    this.$log = $log;
    this._log = null;
    this.socketService = socketService;

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  pushLog(data){
    this.log = '<br/>' + data + this.log;
  }

  clear() {
    this.log = '';
  }

  get log() {
    return this._log;
  }

  set log(log) {
    this._log = log;
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('printConsoleMessage', (data) => {
      this.pushLog(data);
    });
  }

  initService() {
  }
}

export default LoggerService;
