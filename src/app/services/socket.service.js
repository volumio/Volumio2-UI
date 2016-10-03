class SocketService {
  constructor($rootScope, $http, $window, $log) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.$http = $http;
    this.$window = $window;
    this.$log = $log;

    this._host = null;
    this.connectToFallbackHost = false;
    this.host2 = null;
  }

  changeHost(host) {
    if (this.$window.socket) {
      this.$window.socket.disconnect();
      this.$window.socket.removeAllListeners();
    }
    this.$window.socket = io(this.host);
    this.$window.socket.connect();
    this.$window.socket.on('connect_error', () => {
      this.$log.debug(`Socket connect_error for host ${this.host}`);
      this._connectToFallbackHost();
    });
    this.$window.socket.on('connect_timeout', () => {
      this.$log.debug(`Socket connect_timeout for host ${this.host}`);
      this._connectToFallbackHost();
    });
    this.$rootScope.$emit('socket:init');
  }

  _connectToFallbackHost() {
    if (!this.connectToFallbackHost && this.host2) {
      this.connectToFallbackHost = true;
      this.$log.info(`Try to connect to host2 ${this.host2}`);
      this.host = this.host2;
    }
  }

  get isConnected() {
    return this.$window.socket.connected;
  }

  on(eventName, callback) {
    // this.$log.debug('on', eventName);
    return this.$window.socket.on(eventName, (data) => {
      //this.$log.debug(arguments);
      //this.$log.debug(data);
      this.$rootScope.$apply(function() {
        if (callback) {
          //this.$log.debug(data);
          //callback.apply(socket, data);
          callback(data);
        }
      });
    });
  }

  off(eventName, fn) {
    // this.$log.debug('off', eventName);
    this.$window.socket.off(eventName, fn);
  }

  emit(eventName, data, callback) {
    //this.$log.debug('emit', eventName);
    this.$window.socket.emit(eventName, data, (data) => {
      //let arg = arguments;
      this.$rootScope.$apply(function() {
        if (callback) {
          //callback.apply(socket, arg);
          callback(data);
        }
      });
    });
  }

  connect(callback) {
    this.$window.socket.on('connect', () => {
      this.$log.debug('Socket connect');
      callback();
    });
  }

  reconnect(callback) {
    this.$window.socket.on('reconnect', () => {
      this.$log.debug('Socket reconnect');
      this.$rootScope.$emit('socket:reconnect');
      callback();
    });
  }

  disconnect(callback) {
    this.$window.socket.on('disconnect', (socket) => {
      this.$log.debug('Socket disconnect');
      callback(socket);
    });
  }

  set host(host) {
    this._host = host;
    this.changeHost(host);
    this.$log.debug('New host:', this._host);
  }

  get host() {
    return `${this._host}`;
  }
}

export default SocketService;
