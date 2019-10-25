class ModalRipperController {
  constructor($uibModalInstance, dataObj, ripperService, browseService, playerService, Upload, socketService, $log) {
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

  uploadCDAlbumart() {
    this.Upload.upload({
      url: `${this.socketService.host}/albumart-upload`,
      data: {filename: this.albumart, artist: this.dataObj.artist, album: this.dataObj.album}
    }).then((resp)=> {
                if (resp.status === 200 && resp.data && resp.data.path) {
                  this.dataObj.albumart = resp.data.path;
                }
            });
  }
}

export default ModalRipperController;
