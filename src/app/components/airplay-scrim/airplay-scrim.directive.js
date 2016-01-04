class AirplayScreemDirective {
  constructor() {
    'ngInject';
    let directive = {
      restrict: 'E',
      scope: false,
      template: '<div id="airplayScrim" ng-click="airplayScrim.openScrimModal()"></div>',
      controller: AirplayScrimController,
      controllerAs: 'airplayScrim'
    };
    return directive;
  }
}

class AirplayScrimController {
  constructor($rootScope, socketService, $document, modalService, $state) {
    'ngInject';
    this.socketService = socketService;
    this.$document = $document[0];
    this.modalService = modalService;
    this.$state = $state;

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushState', (data) => {
      if (data.service === 'airplay') {
        this.$state.go('volumio.playback');
        this.$document.querySelector('#airplayScrim').classList.add('showScrim');
      } else {
        this.$document.querySelector('#airplayScrim').classList.remove('showScrim');
      }
    });
  }

  openScrimModal() {
    this.modalService.openModal(
      'ModalGotitController',
      'app/components/modals/modal-gotit.html',
      {title: 'Airplay', message: 'All functionalities will be resumed upon Airplay stop'});
  }

  initService() {
  }
}

export default AirplayScreemDirective;
