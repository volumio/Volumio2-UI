class RipperService {
  constructor($rootScope, socketService, modalService, themeManager, mockService) {
    'ngInject';
    this.socketService = socketService;
    this.modalService = modalService;
    this.themeManager = themeManager;
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
    console.log('emit ripCD', ripDataObj);
    this.socketService.emit('callMethod', {'endpoint':'music_service/cd_controller','method':'ripCD','data':ripDataObj});
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('cdRipStart', (data) => {
      console.log('cdRipStart', data);
      this.modalDataObj = data;
      this.cdRipStart(this.modalDataObj);
    });
  }

  initService() {
  }
}

export default RipperService;
