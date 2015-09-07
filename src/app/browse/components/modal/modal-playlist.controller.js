class ModalController {
  constructor (socketService, $modalInstance, params) {
    'ngInject';
    this.socketService = socketService;
    this.$modalInstance = $modalInstance;
    this.params = params;
    this.customPlaylist = '';
  }

  addToPlaylist(playlist) {
    //console.log(this.params.item);
    this.doAddToPlaylist(playlist);
    this.$modalInstance.close();
  }

  addToCustomPlaylist() {
    this.doAddToPlaylist(this.customPlaylist);
    this.$modalInstance.close();
  }

  doAddToPlaylist(playlist){
    this.socketService.emit('addToPlaylist', {
      name: playlist,
      uri: this.params.item.uri,
      service: this.params.item.service
    });
  }

  ok() {
    this.$modalInstance.close();
  }

  cancel() {
    this.$modalInstance.dismiss('cancel');
  }
}

export default ModalController;
