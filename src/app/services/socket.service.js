class SocketService {
  constructor($rootScope, $http, $window) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.$http = $http;
    this.$window = $window;
    this._host = null;
  }

  changeHost(host) {
    if (this.$window.socket) {
      this.$window.socket.disconnect();
      this.$window.socket.removeAllListeners();
    }
    this.$window.socket = io(this.host);
    this.$window.socket.connect();
    this.$rootScope.$emit('socket:init');
  }

  get isConnected() {
    return this.$window.socket.connected;
  }

  on(eventName, callback) {
    //console.log('on', eventName);
    return this.$window.socket.on(eventName, (data) => {
      //console.log(arguments);
      //console.log(data);
      this.$rootScope.$apply(function() {
        if (callback) {
          //console.log(data);
          //callback.apply(socket, data);
          callback(data);
        }
      });
    });
  }

  off(eventName, fn) {
    // console.log('off', eventName);
    this.$window.socket.off(eventName, fn);
  }

  emit(eventName, data, callback) {
    //console.log('emit', eventName);
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
      console.info('Socket connect');
      callback();
    });
  }

  reconnect(callback) {
    this.$window.socket.on('reconnect', () => {
      console.info('Socket reconnect');
      this.$rootScope.$emit('socket:reconnect');
      callback();
    });
  }

  disconnect(callback) {
    this.$window.socket.on('disconnect', (socket) => {
      console.info('Socket disconnect');
      callback(socket);
    });
  }

  set host(host) {
    this._host = host;
    this.changeHost(host);
    console.info('New host:', this._host);
  }

  get host() {
    return this._host;
  }
}

export default SocketService;
