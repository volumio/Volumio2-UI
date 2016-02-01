class ModalPlaylistController {
  constructor(socketService, $uibModalInstance, playlistService, dataObj) {
    'ngInject';
    this.socketService = socketService;
    this.$uibModalInstance = $uibModalInstance;
    this.playlistService = playlistService;
    this.dataObj = dataObj;
  }

  addToFavourites() {
    this.playlistService.addToFavourites(this.dataObj.item);
    this.$uibModalInstance.close();
  }

  addToPlaylist(playlist) {
    this.doAddToPlaylist(playlist);
    this.$uibModalInstance.close();
  }

  addToCustomPlaylist() {
    this.doAddToPlaylist(this.customPlaylist);
    this.$uibModalInstance.close();
  }

  doAddToPlaylist(playlist) {
    this.playlistService.addToPlaylist(this.dataObj.item, playlist);
    this.$uibModalInstance.close();
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}

export default ModalPlaylistController;
