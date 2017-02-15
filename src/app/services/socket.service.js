class SocketService {
  constructor($rootScope, $http, $window, $log) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.$http = $http;
    this.$window = $window;
    this.$log = $log;

    this._host = null;
    this.connectToFallbackHost = false;
    this.hosts = [ null ];
    this._hostIndex = 0;
  }

  changeHost() {
    if (this.$window.socket) {
      this.$window.socket.disconnect();
      this.$window.socket.removeAllListeners();
    }

    let protocol = this.host.split('//', 1)[0] + '//';
    let site = this.host.substring(protocol.length);
    let host = site.split('/', 1)[0];
    let path = site.substring(host.length).replace(/\/+$/, '') + '/socket.io';
    host = protocol + host;

    this.$log.info(`Socket connect to host ${host} path ${path}`);
    this.$window.socket = io(host, {path: path, timeout: 500});
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
    let host;
    do {
      this._hostIndex = (this._hostIndex + 1) % this.hosts.length;
      host = this.hosts[this._hostIndex];
    } while ( ! host);
    this._host = host;
    this.$log.info(`Try to connect to host ${this._hostIndex} ${this._host}`);
    this.changeHost();
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
    this.hosts[0] = host;
    this._host = host;
    this.changeHost();
    this.$log.debug('New host:', this._host);
  }

  get host() {
    return `${this._host}`;
  }
}

export default SocketService;
