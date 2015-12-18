class BrowseController {
  constructor(browseService, playQueueService, playlistService, socketService,
      modalService) {
    'ngInject';
    this.browseService = browseService;
    this.playQueueService = playQueueService;
    this.playlistService = playlistService;
    this.socketService = socketService;
    this.modalService = modalService;
    let boxTable = angular.element('.boxTable')[0];
    let boxTableTop = boxTable.getBoundingClientRect().top;
    let boxTableMaxHeight = window.innerHeight - boxTableTop - 60;
    boxTable.style.height = boxTableMaxHeight + 'px';
  }

  fetchLibrary(item) {
    console.log(item);
    this.browseService.currentList = item;
    this.browseService.fetchLibrary(item);
    this.selectedSource = item;
    this.browseService.isBrowsing = true;
  }

  backHome() {
    this.searchField = '';
    this.browseService.isBrowsing = false;
    this.browseService.list = [];
  }

  play(item) {
    if (this.browseService.currentList.uri === 'playlists') {
      this.playQueueService.playPlaylist(item);
    } else {
      this.playQueueService.addPlay(item);
    }
  }

  addToQueue(item) {
    if (this.browseService.currentList.uri === 'playlists') {
      this.playQueueService.enqueue(item);
    } else {
      this.playQueueService.add(item);
    }
  }

  clickListItem(item) {
    if (item.type !== 'song') {
      this.fetchLibrary(item);
    }
  }
  dblClickListItem(item) {
    if ( item.type === 'song') {
      this.play(item);
    }
  }

  addToPlaylist(item) {
    let
      templateUrl = 'app/browse/components/modal/modal-playlist.html',
      controller = 'ModalPlaylistController',
      params = {
        title: 'Add to playlist',
        playlists: this.playlistService.playlists,
        item: item
      };
    this.modalService.openModal(
      controller,
      templateUrl,
      params,
      'sm');
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
