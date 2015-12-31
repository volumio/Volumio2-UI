class PlaylistService {
  constructor($rootScope, socketService, $timeout) {
    'ngInject';
    this.socketService = socketService;
    this.$timeout = $timeout;
    this.playlists = [];

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  add(item, playlist) {
    this.socketService.emit('addToPlaylist', {
      name: playlist,
      uri: item.uri,
      service: (item.service || null)
    });
    //NOTE the BE should send a new pushListPlaylist after creating a new playlist
    let tHandler = this.$timeout(() => {
      this.initService();
      this.$timeout.cancel(tHandler);
    }, 3000);
  }

  remove(item, playlist) {
    console.log('removeFromPlaylist', item, playlist);
    this.socketService.emit('removeFromPlaylist', {
      name: playlist,
      uri: item.uri
    });
  }

  addToFavourites(item) {
    if (item && item.uri) {
      this.socketService.emit('addToFavourites', {
        uri: item.uri,
        service: (item.service || null)
      });
    }
  }

  removeFromFavourites(item) {
    if (item && item.uri) {
      this.socketService.emit('removeFromFavourites', {
        uri: item.uri,
        service: (item.service || null)
      });
    }
  }

  savePlaylist() {
  }

  deletePlaylist(playlist) {
    this.socketService.emit('deletePlaylist', {value: playlist});
  }

  renamePlaylist() {
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
