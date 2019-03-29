class CustomTranslationController{
  constructor($scope, $rootScope, socketService, mockService, $log, $translate) {
    'ngInject';
    this.socketService = socketService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$log = $log;
    this.$translate = $translate;
    this.init();
  }

  init(){
    this.registerListner();
    this.initService();
  }

  registerListner(){
    this.socketService.on('pushAllLanguages', function (data)
    {
      console.log("dati ricevuti:", data);
    });
  }

  initService() {
  }

  test(){
    console.log("funzione test è stata lanciata");
    this.socketService.emit('getAllLanguages');
  }
}

/*per gestire tutto bisogna mettere emit per lanciare una funzione e on per ascoltare la risposta
  nel backend bisogna andare in volumio/plugin/user_interface/index.js per mettere on sulla richiesta e emit per
  mandare la risposta che stiamo ascoltando
  quindi esempio: FE: this.socketService.emit('funzione');  BE: connWebSocket.on('funzione', function () {})
  viceversa: FE: this.socketService.on('risposta', function (data){}) BE: selfConnWebSocket.emit('risposta', data);
*/

export default CustomTranslationController;
