export default class FirmwareUploadPluginController {
  constructor($scope, socketService, mockService, $log, Upload, modalService, updaterService) {
    'ngInject';
    this.socketService = socketService;
    this.$scope = $scope;
    this.$log = $log;
    this.Upload = Upload;
    this.modalService = modalService;
    // this.$translate = $translate;
    this.updaterService = updaterService;
    this.init();
  }

  init() {
    this.registerListner();
    this.initService();
    this.modalPayload = {};
    this.resolveTranslations();
  }

  uploadFirmware() {
    const uploadModal = this.modalService.openModal(
      'ModalUpdaterController',
      'app/components/modals/modal-updater.html',
      this.modalPayload,
      'lg');

    //INIT uploader status for show progressbar
    this.updaterService.status = 'updateProgress';
    this.updaterService.updateProgress = {
      status: this.modalPayload.description,
      progress: 0
    };

    this.Upload.upload({
        url: `${this.socketService.host}/firmware-upload`,
        data: {filename: this.firmwareFile}
      })
      .then((resp) => {
      }, (resp) => {
        this.$log.debug('Error status: ' + resp.status);
      }, (evt)  => {
          this.uploadPercentage = parseInt(100.0 * evt.loaded / evt.total);
          this.updaterService.updateProgress.progress = this.uploadPercentage;
          if (this.uploadPercentage === 100) {
            uploadModal.close();
          }
        });
  }

  resolveTranslations() {
    this.modalPayload.title = 'Uploading Firmware File';
    this.modalPayload.description = 'Uploading Firmware File';
    // this.$translate(['PLUGINS.FIRMWARE_UPLOAD.MODAL_TITLE', 'PLUGINS.FIRMWARE_UPLOAD.MODAL_DESCRIPTION'])
    //   .then(translations => {
    //     this.modalPayload.title = translations['PLUGINS.FIRMWARE_UPLOAD.MODAL_TITLE'];
    //     this.modalPayload.description = translations['PLUGINS.FIRMWARE_UPLOAD.MODAL_DESCRIPTION'];
    //   });
  }

  registerListner() {}

  initService() {}
}
