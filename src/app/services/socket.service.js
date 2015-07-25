class SocketService {
  constructor ($rootScope, $http, $window, $log, $timeout) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.$http = $http;
    this.$log = $log;
    this.$window = $window;
    this.$timeout = $timeout;

    //this._host = 'http://localhost:3000';
    //this._host = 'http://192.168.192.14:3000';
    this._host = null;
    //this.initSocket();

  }

  // initSocket(){
  //   // TODO abort call with promise timeout
  //   this.$timeout(() => {
  //     console.log(this.$window.location.hostname);
  //     let apiHost = 'http://' + this.$window.location.hostname + ':3000/api/host';
  //     apiHost = 'http://192.168.192.14:3000/api/host';
  //     this.$http.get(apiHost).then((res) => {
  //       console.log(res);
  //       this.host = res.data.host;
  //       this.$window.socket = io(this.host+':3000');
  //
  //     }, (res) => {
  //       console.log(res);
  //     });
  //   },1);
  // }

  changeHost(host){
    this.host = host;
    this.$window.socket.disconnect();
    this.$window.socket = undefined;
    delete this.$window.socket;
    this.$rootScope.$emit('socket:init');
  }

  on(eventName, callback) {
    //console.log('on', eventName);
    socket.on(eventName, (data) => {
      //console.log(arguments);
      //console.log(data);
      this.$rootScope.$apply(function () {
        if (callback) {
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
      this.$rootScope.$apply(function () {
        if (callback) {
          //callback.apply(socket, arg);
          callback(data);
        }
      });
    });
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
