class ModalController {
  constructor (socketService, $modalInstance, playlistService, params) {
    'ngInject';
    this.socketService = socketService;
    this.$modalInstance = $modalInstance;
    this.playlistService = playlistService;
    this.params = params;
  }

  addToFavourites() {
    this.playlistService.addToFavourites(this.params.item);
    this.$modalInstance.close();
  }

  addToPlaylist(playlist) {
    this.doAddToPlaylist(playlist);
    this.$modalInstance.close();
  }

  addToCustomPlaylist() {
    this.doAddToPlaylist(this.customPlaylist);
    this.$modalInstance.close();
  }

  doAddToPlaylist(playlist){
    this.playlistService.add(this.params.item, playlist);
    this.$modalInstance.close();
  }

  cancel() {
    this.$modalInstance.dismiss('cancel');
  }
}

export default ModalController;
