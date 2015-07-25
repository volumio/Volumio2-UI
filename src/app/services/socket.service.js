class SocketService {
  constructor ($log, $rootScope, $window) {
    'ngInject';
    this.$log = $log;
    this.$window = $window;
    this.$rootScope = $rootScope;
    //this._host = 'http://localhost:3000';
    //this._host = 'http://192.168.192.14:3000';
    this._host = null;
    this.initSocket();
    console.log('in socket constr');
  }

  initSocket(){
    // TODO abort call with promise timeout
    $http.get('http://localhost:3000/api/host').then((res.data) => {
      console.log(res.data);
      this.host = res.data.host;
      this.$window.socket = io(this.host);
    }, (res) => {
      console.log(res);
    });


    this.$rootScope.$emit('socket:init');
  }

  changeHost(host){
    console.log(host);
    this.host = host;
    this.$window.socket.disconnect();
    this.$window.socket = undefined;
    delete this.$window.socket;
    this.initSocket();
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
  }

  get host() {
    return this._host;
  }
}

export default SocketService;
