class ModalRipperController {
  constructor(
    $uibModalInstance,
    dataObj,
    ripperService,
    browseService,
    playerService,
    Upload,
    socketService,
    $log
  ) {
    "ngInject";
    this.$uibModalInstance = $uibModalInstance;
    this.ripperService = ripperService;
    this.dataObj = dataObj;
    this.browseService = browseService;
    this.playerService = playerService;
    this.socketService = socketService;
    this.Upload = Upload;
    this.$log = $log;
  }

  startToRipCd() {
    this.ripperService.startToRipCd();
    this.$uibModalInstance.close();
    this.browseService.backHome();
  }

  cancel() {
    this.$uibModalInstance.dismiss("cancel");
  }

  uploadAlbumart() {
    this.Upload.upload({
      url: `${this.socketService.host}/backgrounds-upload`,
      data: {filename: this.albumart}
    }).then(
      resp => {
        this.uploadPercentage = false;
      },
      resp => {
        this.uploadPercentage = false;
        this.$log.debug("Error status: " + resp.status);
      },
      evt => {
        this.uploadPercentage = parseInt((100.0 * evt.loaded) / evt.total);

        if (this.uploadPercentage === 100) {
          this.uploadPercentage = false;
        }
      }
    );
  }
}

export default ModalRipperController;
