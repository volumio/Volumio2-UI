class ModalWebRadioController {
  constructor(socketService, $modalInstance, playlistService, dataObj) {
    'ngInject';
    this.socketService = socketService;
    this.$modalInstance = $modalInstance;
    this.playlistService = playlistService;
    this.dataObj = dataObj;
    this.addOrEdit = (dataObj.item) ? 'add': 'edit';
    console.log(dataObj.item);
  }

  addWebradio() {
    this.playlistService.addWebRadio(this.dataObj.item);
    this.$modalInstance.close();
  }

  cancel() {
    this.$modalInstance.dismiss('cancel');
  }
}

export default ModalWebRadioController;
