class ModalPlaylistController {
  constructor(socketService, $modalInstance, playlistService, dataObj) {
    'ngInject';
    this.socketService = socketService;
    this.$modalInstance = $modalInstance;
    this.playlistService = playlistService;
    this.dataObj = dataObj;
  }

  addToFavourites() {
    this.playlistService.addToFavourites(this.dataObj.item);
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

  doAddToPlaylist(playlist) {
    this.playlistService.addToPlaylist(this.dataObj.item, playlist);
    this.$modalInstance.close();
  }

  cancel() {
    this.$modalInstance.dismiss('cancel');
  }
}

export default ModalPlaylistController;
