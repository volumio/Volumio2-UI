class BrowseController {
  constructor($scope, browseService, playQueueService, playlistService, socketService,
      modalService, $timeout) {
    'ngInject';
    this.browseService = browseService;
    this.playQueueService = playQueueService;
    this.playlistService = playlistService;
    this.socketService = socketService;
    this.modalService = modalService;
    this.$timeout = $timeout;
  }

  fetchLibrary(item, back = false) {
    console.log(item);
    this.browseService.fetchLibrary(item, back);
  }

  backHome() {
    this.searchField = '';
    this.browseService.backHome();
  }

  play(item) {
    if (this.browseService.currentFetchRequest && this.browseService.currentFetchRequest.uri === 'playlists') {
      this.playQueueService.playPlaylist(item);
    } else {
      this.playQueueService.addPlay(item);
    }
  }

  addToQueue(item) {
    if (this.browseService.currentFetchRequest.uri === 'playlists') {
      this.playQueueService.enqueue(item);
    } else {
      this.playQueueService.add(item);
    }
  }

  clickListItem(item) {
    if (item.type !== 'song' && item.type !== 'webradio' && item.type !== 'mywebradio' && item.type !== 'cuesong') {
      this.fetchLibrary(item);
    }
  }
  dblClickListItem(item) {
    if (item.type === 'song' || item.type === 'webradio' || item.type === 'mywebradio') {
      this.play(item);
    } else if (item.type === 'cuesong') {
      this.playQueueService.addPlayCue(item);
    }
  }

  addToPlaylist(item) {
    //TODO this is not necessary
    this.playlistService.refreshPlaylists();
    let
      templateUrl = 'app/browse/components/modal/modal-playlist.html',
      controller = 'ModalPlaylistController',
      params = {
        title: 'Add to playlist',
        item: item
      };
    this.modalService.openModal(
      controller,
      templateUrl,
      params,
      'sm');
  }

  addWebRadio(item) {
    let
      templateUrl = 'app/browse/components/modal/modal-web-radio.html',
      controller = 'ModalWebRadioController',
      params = {
        title: 'Add web radio',
        item: item
      };
    this.modalService.openModal(
      controller,
      templateUrl,
      params,
      'sm');
  }

  editWebRadio(item) {
    this.addWebRadio(item);
  }

  search() {
    if (this.searchField.length >= 3) {
      if (this.searchTimeoutHandler) {
        this.$timeout.cancel(this.searchTimeoutHandler);
      }
      this.searchTimeoutHandler = this.$timeout(() => {
        console.log('search', this.searchField);
        this.browseService.startPerf = performance.now();
        this.socketService.emit('search', {value: this.searchField});
      }, 300, false);
    }
  }

  //Hamburger menu visibility filters
  showHamburgerMenu(item) {
    let ret = item.type === 'radio-favourites' || item.type === 'radio-category';
    return !ret;
  }

  showPlayButton(item) {
    let ret = item.type === 'folder' || item.type === 'song' ||
        item.type === 'mywebradio' || item.type === 'webradio' ||
        item.type === 'playlist';
    return ret;
  }
  showAddToQueueButton(item) {
    let ret = item.type === 'folder' || item.type === 'song' ||
        item.type === 'mywebradio' || item.type === 'webradio' ||
        item.type === 'playlist';
    return ret;
  }
  showAddToPlaylist(item) {
    let ret = item.type === 'folder' || item.type === 'song';
    return ret;
  }
}

export default BrowseController;
