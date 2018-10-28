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
  constructor($rootScope, socketService, $document, $state, $window, $log) {
    'ngInject';
    this.socketService = socketService;
    this.$document = $document[0];
    this.$state = $state;
    this.$window = $window;
    this.$log = $log;

    if (!this.socketService.isSocketAvalaible()) {
      this.hideSrcrim();
      return;
    }

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
      this.$log.debug('connect');
      this.hideSrcrim();
    });
    this.socketService.reconnect(() => {
      this.$log.debug('reconnect');
      this.hideSrcrim();
    });
    this.socketService.disconnect((socket) => {
      if (this.$document.querySelector('#waitBackendScrim')) {
        this.$document.querySelector('#waitBackendScrim').classList.remove('hideScrim');
      }
      //this.$state.go('volumio.playback');
    });
  }

  initService() {
    if (this.socketService.isConnected) {
      this.hideSrcrim();
    }
  }

  hideSrcrim() {
    this.$document.querySelector('#waitBackendScrim').classList.add('hideScrim');
  }
}

export default WaitBackendScrimDirective;
