class ModalWebRadioController {
  constructor(socketService, $uibModalInstance, playlistService, dataObj) {
    'ngInject';
    this.socketService = socketService;
    this.$uibModalInstance = $uibModalInstance;
    this.playlistService = playlistService;
    this.dataObj = dataObj;
    this.addOrEdit = (dataObj.item) ? 'edit' : 'add';
  }

  addWebradio() {
    this.playlistService.addWebRadio(this.dataObj.item);
    this.$uibModalInstance.close();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}

export default ModalWebRadioController;
