class BrowseMusicController {
  constructor($scope, browseService, playQueueService, playlistService, socketService,
    modalService, $timeout, matchmediaService, $compile, $document, $rootScope, $log, playerService,
    uiSettingsService, $state, themeManager, $stateParams, mockService) {
    'ngInject';
    this.$log = $log;
    this.browseService = browseService;
    this.playQueueService = playQueueService;
    this.playlistService = playlistService;
    this.socketService = socketService;
    this.modalService = modalService;
    this.playerService = playerService;
    this.$timeout = $timeout;
    this.matchmediaService = matchmediaService;
    this.$compile = $compile;
    this.$document = $document;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.uiSettingsService = uiSettingsService;
    this.themeManager = themeManager;
    this.$stateParams = $stateParams;
    this.isDedicatedSearchView = false;
    this.historyUri = [];
    this.mockService = mockService;
    this.listViewSetting = 'list';
    this.mockArtistPage = mockService._mock.browseMusic.getArtistPageContent;
    this.mockAlbumPage = mockService._mock.browseMusic.getAlbumPageContent;

    if (this.browseService.isBrowsing || this.browseService.isSearching) {
      // this.renderBrowseTable();
    }
    $scope.$on('browseService:fetchEnd', () => {
      // this.renderBrowseTable();
    });

    this.initController();
  }

  initController() {
    console.log(this.browseService);
    /* I receive it also when I search */
    this.socketService.on('pushBrowseLibrary', (data) => {
      console.log(data);
      console.log(this.browseService);
    });

    
    /* let bindedBackListener = this.backListener.bind(this);
    this.$document[0].addEventListener('keydown', bindedBackListener, false);
    this.$scope.$on('$destroy', () => {
      this.$document[0].removeEventListener('keydown', bindedBackListener, false);
    });

    this.$scope.$watch( () => this.$stateParams.isDedicatedSearch , (isDedicatedSearch) => {
      if (isDedicatedSearch) {
        this.setDedicatedSearch();
      } else {
        this.unsetDedicatedSearch();
      }
    }, true); */
  }



  fetchLibrary(item, back = false) {
    this.$log.debug(item);
    if (item.uri !== 'cd') {
      this.browseService.fetchLibrary(item, back);
    }
  }

  backHome() {
    this.searchField = '';
    this.browseService.backHome();
  }

  clickBack() {
    if (this.browseService.breadcrumbs) {
      this.fetchLibrary({uri: this.browseService.breadcrumbs.uri}, true);
    } else {
      this.backHome();
    }
  }

  handleItemClick(item) {
    console.log(item);
  }

  openMusicCardContenxtList(e) {
    e.stopPropagation();
    console.log('Context menu will open...');
    alert('Context menu will open...');
  }
  
  playMusicCardClick(e, item) {
    e.stopPropagation();
    console.log('Start playing...', item);
    alert('Start playing...');
  }

  showPlayButton(item) {
    if (!item) {
      return false;
    }
    let ret = item.type === 'folder' || item.type === 'song' ||
        item.type === 'mywebradio' || item.type === 'webradio' ||
        item.type === 'playlist' || item.type === 'cuesong' ||
        item.type === 'remdisk' || item.type === 'cuefile' ||
        item.type === 'folder-with-favourites' || item.type === 'internal-folder';
    return ret;
  }

  addToPlaylist(item) {
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
      'sm'
    );
  }

  showArtistDetails(info) {
    const templateUrl = 'app/browse-music/components/modal/modal-artist-details.html';
    const controller = 'ModalArtistDetailsController';
    const params = {
      title: info.title,
      item: info
    };
    this.modalService.openModal(
      controller,
      templateUrl,
      params,
      'md'
    );
  }

  timeFormat(time) {   
    // Hours, minutes and seconds
    let hrs = ~~(time / 3600);
    let mins = ~~((time % 3600) / 60);
    let secs = ~~time % 60;
    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = '';
    if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }
    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
  }

  addToFavorites(e, item) {
    if (e) {
      e.stopPropagation();
    }
    if (!item) {
      return;
    }
    item.favorite ? alert('Will remove from favorites') : alert('Will add to favorites');
  }

  /* changeListViewSetting(view) {
    if (['grid', 'list'].indexOf(view) === -1) {
      console.error('Invalid list view type. Must be one grid or list, got ' + view);
      return;
    }
    this.listViewSetting = view;
  } */

}

export default BrowseMusicController;