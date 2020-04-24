class BrowseMusicController {
  constructor($scope, browseService, playQueueService, playlistService, socketService,
    modalService, $timeout, matchmediaService, $compile, $document, $rootScope, $log, playerService,
    uiSettingsService, $state, themeManager, $stateParams, mockService, $http) {
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
    this.$http = $http;

    this.currentItemMetas = {};

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
      this.fetchAdditionalMetas();
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

  showCreditsDetails(details) {
    const templateUrl = 'app/browse-music/components/modal/modal-credits-details.html';
    const controller = 'ModalCreditsDetailsController';
    const params = {
      title: details.title,
      item: details.info
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

  fetchAdditionalMetas() {
    this.currentItemMetas = {};
    if (this.browseService.info) {
      if (this.browseService.info.type && this.browseService.info.type === 'artist' && this.browseService.info.title) {
        return this.getArtistMetas(this.browseService.info);
      }
    }

  }

  getArtistMetas(artistInfo) {
    let requestObject = {
      'mode':'storyArtist',
      'artist': artistInfo.title
    };
    return this.requestMetavolumioApi(requestObject);
  }

  requestMetavolumioApi(data) {
    let mataVolumioUrl =  this.socketService.host + '/api/v1/pluginEndpoint';
    let metaObject = {
      'endpoint': 'metavolumio',
      'data': data
    };
    return this.$http.post(mataVolumioUrl, metaObject).then((response) => {
      if (response.data && response.data.success && response.data.data && response.data.data.value) {
        this.currentItemMetas.story = response.data.data.value;
      }
    });
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
