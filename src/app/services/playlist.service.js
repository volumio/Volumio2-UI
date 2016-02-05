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

  //Playlist
  addToPlaylist(item, playlist) {
    console.log('addToPlaylist', item, playlist);
    this.socketService.emit('addToPlaylist', {
      name: playlist,
      uri: item.uri,
      service: (item.service || null)
    });
  }

  removeFromPlaylist(item, playlist) {
    console.log('removeFromPlaylist', item, playlist);
    this.socketService.emit('removeFromPlaylist', {
      name: playlist,
      uri: item.uri
    });
  }

  deletePlaylist(playlist) {
    this.socketService.emit('deletePlaylist', {value: playlist});
  }

  //Favourites
  addToFavourites(item) {
    if (item && item.uri) {
      console.log('addToFavourites', item);
      this.socketService.emit('addToFavourites', {
        uri: item.uri,
        service: (item.service || null)
      });
    }
  }

  removeFromFavourites(item) {
    if (item && item.uri) {
      console.log('removeFromFavourites', item);
      this.socketService.emit('removeFromFavourites', {
        uri: item.uri,
        service: (item.service || null)
      });
    }
  }

  //Web radio
  addWebRadio(item) {
    console.log('addWebRadio', item);
    if (item && item.title && item.uri) {
      this.socketService.emit('addWebRadio', {
        name: item.title,
        uri: item.uri
      });
    }
  }

  editWebRadio(item) {
    console.log('editWebRadio', item);
    this.addWebRadio(item);
  }

  deleteWebRadio(item) {
    console.log('removeWebRadio', item);
    if (item && item.title) {
      this.socketService.emit('removeWebRadio', {
        name: item.title
      });
    }
  }

  addWebRadioToFavourites(item) {
    console.log('addWebRadioToFavourites', item);
    this.addToFavourites(item);
  }
  removeWebRadioFromFavourites(item) {
    console.log('removeWebRadioFromFavourites', item);
    this.removeFromFavourites(item);
  }

  //TODO: this should be not necessary, should pushed from BE
  refreshPlaylists() {
    this.socketService.emit('listPlaylist');
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
