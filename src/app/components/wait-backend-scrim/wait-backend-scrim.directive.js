class WaitBackendScrimDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      scope: false,
      template: '<div id="waitBackendScrim"></div>',
      controller: WaitBackendScrimController,
      controllerAs: 'waitBackendScrim'
    };
    return directive;
  }
}

class WaitBackendScrimController {
  constructor($rootScope, socketService, $document) {
    'ngInject';
    this.socketService = socketService;
    this.$document = $document[0];

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.connect(() => {
      console.log('Socket connected');
      this.$document.querySelector('#waitBackendScrim').classList.add('hideScrim');
    });
    this.socketService.disconnect((socket) => {
      console.log('Socket disconnected', socket);
      this.$document.querySelector('#waitBackendScrim').classList.remove('hideScrim');
    });
  }

  initService() {
  }
}

export default WaitBackendScrimDirective;
