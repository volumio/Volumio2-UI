class SocketService {
  constructor($rootScope, $http, $window) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.$http = $http;
    this.$window = $window;
    this._host = null;
  }

  changeHost(host) {
    console.log('Change host');
    this.host = host;
    this.disconnectMe();
    this.$window.socket = io(this.host);
    console.info('connected to', this.host);
    this.$rootScope.$emit('socket:init');
  }

  get isConnected() {
    return this.$window.socket.connected;
  }

  on(eventName, callback) {
    console.log('on', eventName);
    this.$window.socket.on(eventName, (data) => {
      this.$rootScope.$apply(function() {
        if (callback) {
          //console.log(data);
          //callback.apply(socket, data);
          callback(data);
        }
      });
    });
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

  disconnectMe() {
    this.$window.socket.disconnect();
    this.$window.socket = undefined;
    // delete this.$window.socket;
  }

  set host(host) {
    this._host = host;
    console.info('The socket host is:', this._host);
  }

  get host() {
    return this._host;
  }
}

export default SocketService;
