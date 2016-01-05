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

  //Web radio
  addWebRadio(item) {
    console.log('addWebRadio', item);
    if (item && item.name && item.url) {
      console.log('emit');
      this.socketService.emit('addWebRadio', {
        name: item.name,
        url: item.url
      });
    }
  }

  editWebRadio(item) {
    console.log('editWebRadio', item);
    this.addWebRadio(item);
  }

  deleteWebRadio(item) {
    console.log('browse - removeWebRadio', item);
    if (item && item.name) {
      this.socketService.emit('removeWebRadio', {
        name: item.name
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
