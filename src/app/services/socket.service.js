class SocketService {
  constructor($rootScope, $http, $window) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.$http = $http;
    this.$window = $window;
    this._host = null;
  }

  changeHost(host) {
    this.host = host;
    this.disconnectMe();
    this.$window.socket = io(this.host);
    this.$rootScope.$emit('socket:init');
  }

  on(eventName, callback) {
    //console.log('on', eventName);
    socket.on(eventName, (data) => {
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

  emit(eventName, data, callback) {
    //console.log('emit', eventName);
    socket.emit(eventName, data, (data) => {
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
    socket.on('connect', () => {
      callback();
    });
  }

  disconnect(callback) {
    socket.on('disconnect', (socket) => {
      callback(socket);
    });
  }

  disconnectMe() {
    this.$window.socket.disconnect();
    this.$window.socket = undefined;
    delete this.$window.socket;
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
