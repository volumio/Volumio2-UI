class SocketService {
  constructor ($log, $rootScope) {
    'ngInject';
    this.$log = $log;
    this.$rootScope = $rootScope;
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
}

export default SocketService;
