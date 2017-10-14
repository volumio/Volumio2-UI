class PlaylistService {
  constructor($rootScope, socketService, $timeout, $log) {
    'ngInject';
    this.socketService = socketService;
    this.$timeout = $timeout;
    this.$log = $log;

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
    const emitPayload = {
      name: playlist,
      uri: item.uri,
      service: (item.service || null)
    };
    this.$log.debug('addToPlaylist', emitPayload);
    this.socketService.emit('addToPlaylist', emitPayload);
  }

  addQueueToPlaylist(playlist) {
    this.$log.debug('saveQueueToPlaylist', {name: playlist});
    this.socketService.emit('saveQueueToPlaylist', {name: playlist});
  }

  removeFromPlaylist(item, playlist) {
    this.$log.debug('removeFromPlaylist', item, playlist);
    this.socketService.emit('removeFromPlaylist', {
      name: playlist,
      uri: item.uri,
      service: (item.service || null)
    });
  }

  deletePlaylist(playlist) {
    this.socketService.emit('deletePlaylist', {name: playlist});
  }

  //Favourites
  addToFavourites(item) {
    if (item && item.uri) {
      this.$log.debug('addToFavourites', item);
      this.socketService.emit('addToFavourites', {
        uri: item.uri,
        title: item.title,
        service: (item.service || null)
      });
    }
  }

  removeFromFavourites(item) {
    if (item && item.uri) {
      this.$log.debug('removeFromFavourites', item);
      this.socketService.emit('removeFromFavourites', {
        uri: item.uri,
        service: (item.service || null)
      });
    }
  }

  //Web radio
  addWebRadio(item) {
    this.$log.debug('addWebRadio', item);
    if (item && item.title && item.uri) {
      this.socketService.emit('addWebRadio', {
        name: item.title,
        uri: item.uri
      });
    }
  }

  editWebRadio(item) {
    this.$log.debug('editWebRadio', item);
    this.addWebRadio(item);
  }

  deleteWebRadio(item) {
    this.$log.debug('removeWebRadio', item);
    if (item && item.title) {
      this.socketService.emit('removeWebRadio', {
        name: item.title
      });
    }
  }

  addWebRadioToFavourites(item) {
    this.$log.debug('addWebRadioToFavourites', item);
    this.addToFavourites(item);
  }
  removeWebRadioFromFavourites(item) {
    this.$log.debug('removeWebRadioFromFavourites', item);
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
      this.$log.debug('pushListPlaylist', data);
      this.playlists = data;
    });
  }

  initService() {
    this.socketService.emit('listPlaylist');
  }
}

export default PlaylistService;
