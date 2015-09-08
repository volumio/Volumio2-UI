class PlaylistService {
  constructor ($rootScope, socketService) {
    'ngInject';
    this.socketService = socketService;
    this.playlists = [];

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
  }

  add(item, playlist) {
    this.socketService.emit('addToPlaylist', {
      name: playlist,
      uri: item.uri,
      service: (item.service || null)
    });
  }

  remove() {

  }

  addToFavourites(item) {
    this.socketService.emit('addToFavourites', {
      uri: item.uri,
      service: (item.service || null)
    });
  }

  savePlaylist() {
  }

  deletePlaylist(playlist) {
    this.socketService.emit('deletePlaylist', {value: playlist});
  }

  renamePlaylist() {
  }

  start() {

  }

  getNext() {

  }

  getPrev() {

  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushListPlaylist', (data) => {
      console.log('pushListPlaylist', data);
    	this.playlists = data;
    });
  }

  initService() {
    this.socketService.emit('listPlaylist');
  }
}

export default PlaylistService;
