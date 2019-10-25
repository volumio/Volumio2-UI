class RipperService {
  constructor($rootScope, socketService, modalService, themeManager, mockService, $log) {
    'ngInject';
    this.socketService = socketService;
    this.modalService = modalService;
    this.themeManager = themeManager;
    this.$log = $log;
    this.modalDataObj = {};

    // this.modalDataObj = mockService.get('ripper');
    // this.cdRipStart(this.modalDataObj);

    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  cdRipStart(modalData) {
    this.modalService.openModal(
      'ModalRipperController',
      `app/themes/${this.themeManager.theme}/components/modals/modal-ripper.html`,
      this.modalDataObj,
      'lg');
  }

  startToRipCd() {
    let ripDataObj = angular.copy(this.modalDataObj);
    this.$log.debug('emit ripCD', ripDataObj);
    this.socketService.emit('callMethod', {
      'endpoint': 'music_service/cd_controller',
      'method': 'ripCD',
      'data': ripDataObj
    });
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('cdRipStart', (data) => {
      this.$log.debug('cdRipStart', data);
      this.modalDataObj = data;
      if (this.modalDataObj && this.modalDataObj.availableDrives && this.modalDataObj.availableDrives.length) {
        this.modalDataObj.destinationDrive = this.modalDataObj.availableDrives[0];
      }
      this.cdRipStart(this.modalDataObj);
    });
  }

  initService() {
  }
}

export default RipperService;
