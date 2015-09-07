class BrowseController {
  constructor (browseService, playQueueService, socketService, $modal) {
    'ngInject';
    this.browseService = browseService;
    this.playQueueService = playQueueService;
    this.lastItemMenuOpened = null;
    this.socketService = socketService;
    // $window.document.find('.toggleItemMenu').addEventListener('cklick', () => {
    //   console.log('asd');
    // })
    this.$modal = $modal;
    this.browseService.fetchLibrary({
        name: "Music Library",
        uri: "music-library"
      });

    this.socketService.emit('listPlaylist');
    this.socketService.on('pushListPlaylist', (data) => {
      console.log('pushListPlaylist', data);
    	this.playlists = ['Favourites'].concat(data);
    });
  }

  fetchLibrary(item) {
    console.log(item);
    this.browseService.fetchLibrary(item);
  }

  play(item) {
    console.log('browse play', item);
    this.socketService.emit('addPlay', {
      uri: item.uri,
      service: (item.service || null)
    });
  }


  addToQueue(item) {
    this.playQueueService.add(item);
  }

  clickListItem(item, event) {
    if (event.target.tagName === 'TD' && item.type !== 'song') {
      this.fetchLibrary(item);
    }
  }
  dblClickListItem(item, event) {
    if (event.target.tagName === 'TD' && item.type === 'song') {
      this.play(item);
    }
  }

  addToPlaylist(item) {
    let modalInstance = this.$modal.open({
      animation: true,
      templateUrl: 'app/browse/components/modal/modal-playlist.html',
      controller: 'ModalPlaylistController',
      controllerAs: 'modalPlaylist',
      size: 'sm',
      resolve: {
        params: () => {
          return {
            title: 'Add to playlist',
            playlists: this.playlists,
            item: item
          };
        }
      }
    });

    modalInstance.result.then(function () {
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  }

  addToFavourites(item){
    console.log(item);
    this.socketService.emit('addToPlaylist', {
      name: 'Favourites',
      uri: item.uri,
      service: (item.service || null)
    });
  }

}

export default BrowseController;
