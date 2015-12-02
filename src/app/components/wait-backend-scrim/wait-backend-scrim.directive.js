class WaitBackendScrimDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      scope: false,
      templateUrl: 'app/components/wait-backend-scrim/wait-backend-scrim.html',
      controller: WaitBackendScrimController,
      controllerAs: 'waitBackendScrim'
    };
    return directive;
  }
}

class WaitBackendScrimController {
  constructor($rootScope, socketService, $document, $state, $window) {
    'ngInject';
    this.socketService = socketService;
    this.$document = $document[0];
    this.$state = $state;
    this.$window = $window;
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
    this.socketService.reconnect(() => {
      this.$document.querySelector('#waitBackendScrim').classList.add('hideScrim');
    });
    this.socketService.disconnect((socket) => {
      this.$document.querySelector('#waitBackendScrim').classList.remove('hideScrim');
      this.$state.go('volumio.playback');
    });
  }

  initService() {
    if (this.socketService.isConnected) {
      this.$document.querySelector('#waitBackendScrim').classList.add('hideScrim');
    }
  }
}

export default WaitBackendScrimDirective;
