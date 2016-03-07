class RipperService {
  constructor($rootScope, socketService, modalService, themeManager) {
    'ngInject';
    this.socketService = socketService;
    this.modalService = modalService;
    this.themeManager = themeManager;
    this.modalDataObj = {};
    // this.modalDataObj = {
    //   content: '<strong>Content</strong> of ripper',
    //   title: 'Rip Cd',
    //   artist: 'Noep',
    //   album: 'Move'
    // };
    //
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
      'sm');
  }

  startToRipCd() {
    let obj = {};
    if (this.modalDataObj.artist) {
      obj.artist = this.modalDataObj.artist;
    }
    if (this.modalDataObj.album) {
      obj.album = this.modalDataObj.album;
    }
    console.log('emit ripCD', obj);
    this.socketService.emit('ripCD', obj);
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('cdRipStart', (data) => {
      console.log('cdRipStart', data);
      this.cdRipStart(data);
    });
  }

  initService() {
  }
}

export default RipperService;
