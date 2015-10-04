class BrowseController {
  constructor(browseService, playQueueService, playlistService, socketService, $modal) {
    'ngInject';
    this.browseService = browseService;
    this.playQueueService = playQueueService;
    this.playlistService = playlistService;
    this.socketService = socketService;
    // $window.document.find('.toggleItemMenu').addEventListener('cklick', () => {
    //   console.log('asd');
    // })
    this.$modal = $modal;
    // this.browseService.fetchLibrary({
    //     name: "Music Library",
    //     uri: "music-library"
    //   });
  }

  fetchLibrary(item) {
    console.log(item);
    this.browseService.fetchLibrary(item);
  }

  play(item) {
    this.playQueueService.addPlay(item);
  }


  addToQueue(item) {
    this.playQueueService.add(item);
  }

  clickListItem(item, event) {
    console.log(event);
    if (event.target.tagName !== 'I' && item.type !== 'song') {
      this.fetchLibrary(item);
    }
  }
  dblClickListItem(item, event) {
    if (event.target.tagName !== 'I' && item.type === 'song') {
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
            playlists: this.playlistService.playlists,
            item: item
          };
        }
      }
    });

    modalInstance.result.then(() => {}, () => {});
  }

  deletePlaylist(item) {
    console.log('browse - deletePlaylist', item);
    this.playlistService.deletePlaylist(item.title);
  }

  addToFavourites(item) {
    console.log('browse - addToFavourites', item);
    this.playlistService.addToFavourites(item);
  }

  search() {
    console.log('search', this.searchField);
    this.socketService.emit('search', {value: this.searchField});
  }

}

export default BrowseController;
