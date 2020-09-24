class BrowseMusicController {
  constructor($scope, browseService, playQueueService, playlistService, socketService,
    modalService, $timeout, matchmediaService, $compile, $document, $rootScope, $log, playerService,
    uiSettingsService, $state, themeManager, $stateParams, mockService, $http, authService, $filter) {
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
    this.authService = authService;
    this.filteredTranslate = $filter('translate');

    this.content = {};
    this.loadingCredit = {};
    this.hideInfoHeader = false;
    this.creditRequestOptions = {"timeout":7000};

    $scope.$on('browseService:fetchEnd', () => {
      /* While browsing this makes sense */
      // console.log(this.browseService);
      this.renderBrowsePage(this.browseService.lists);
    });

    if ((this.browseService.isBrowsing || this.browseService.isSearching) && this.browseService.lists) {
      /* However when navigating back from /playback we need to rely on this */
      this.renderBrowsePage(this.browseService.lists);
    }

    $scope.$on('browseService:eject', () => {
      this.backHome();
    });

    $scope.$on('browseService:rip', () => {
      this.backHome();
    });


    this.initController();
  }

  initController() {

    this.socketService.on('pushBrowseLibrary', (data) => {
      this.fetchAdditionalMetas();
      this.fetchTrackTypeImage();
    });

    if (this.browseService.info) {
      this.currentItemMetas = {};
      if (this.browseService.info.type && this.browseService.info.type === 'artist' && this.browseService.info.title) {
        this.getArtistMetas(this.browseService.info);
      } else if (this.browseService.info.artist && this.browseService.info.album) {
        this.getAlbumMetas(this.browseService.info);
        this.getAlbumCredits(this.browseService.info);
      }
    }

    let bindedBackListener = this.backListener.bind(this);
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
    }, true);
  }

  setDedicatedSearch(){
    this.isDedicatedSearchView = true;
    this.browseService.isSearching = true;
    this.browseService.lists = [];
    this.hideInfoHeader = true;
    this.resetBrowsePage();
    this.$timeout( function () {
      document.querySelector('#search-input-form').focus();
    },100 );
  }

  unsetDedicatedSearch(){
    this.hideInfoHeader = false;
    if (this.browseService.isSearching) {
      this.isDedicatedSearchView = false;
      this.browseService.isSearching = false;
      if (!this.browseService.isBrowsing) {
        this.browseService.lists = undefined;
        this.resetBrowsePage();
      } else if (this.browseService.lastBrowseLists) {
        this.browseService.lists = this.browseService.lastBrowseLists;
        this.renderBrowsePage(this.browseService.lists);
      }
    }

  }

  backListener() {
    let prventDefault;
    if (event.keyCode === 8) {
      let d = event.srcElement || event.target;
      if ((d.tagName.toUpperCase() === 'INPUT' &&
          (
             d.type.toUpperCase() === 'TEXT' ||
             d.type.toUpperCase() === 'PASSWORD' ||
             d.type.toUpperCase() === 'FILE' ||
             d.type.toUpperCase() === 'SEARCH' ||
             d.type.toUpperCase() === 'EMAIL' ||
             d.type.toUpperCase() === 'NUMBER' ||
             d.type.toUpperCase() === 'DATE')
          ) ||
          d.tagName.toUpperCase() === 'TEXTAREA') {
        prventDefault = d.readOnly || d.disabled;
      } else {
        prventDefault = true;
      }
    }
    if (prventDefault) {
      event.preventDefault();
      if (this.browseService.breadcrumbs) {
        this.fetchLibrary({uri: this.browseService.breadcrumbs.uri}, true);
      }
    }
  }


  fetchLibrary(item, back = false) {
    this.$log.debug(item);
    if (item.uri === '/' && back) {
      this.backHome();
      return;
    }
    if (item.uri !== 'cd') {
      this.browseService.fetchLibrary(item, back);
    }
  }

  /*
    ====== New navigation stack back functionality ======
  */
  goBack() {
    this.resetBrowsePage();
    this.browseService.goBack();
  }

  backHome() {
    this.resetBrowsePage();
    this.searchField = '';
    this.browseService.backHome();
    this.browseService.info = null;
  }

  clickBack() {
    if (this.browseService.breadcrumbs) {
      this.fetchLibrary({uri: this.browseService.breadcrumbs.uri}, true);
    } else {
      this.backHome();
    }
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

  safeRemoveDrive(item) {
    this.socketService.emit('safeRemoveDrive', item);
  }

  updateFolder(item) {
    this.socketService.emit('updateDb', item);
  }

  deleteFolder(curUri, item) {
    this.socketService.emit('deleteFolder', {'curUri':curUri, 'item':item});
  }

  search() {
    if (this.searchField && this.searchField.length >= 3) {
      this.browseService.isSearching = true;
      if (this.searchTimeoutHandler) {
        this.$timeout.cancel(this.searchTimeoutHandler);
      }
      this.searchTimeoutHandler = this.$timeout(() => {
        let emitPayload = {};
        if (this.isDedicatedSearchView) {
          emitPayload = {
            type: this.browseService.filterBy,
            value: this.searchField
          };
        } else {
          emitPayload = {
            type: this.browseService.filterBy,
            value: this.searchField,
            plugin_name: this.browseService.currentFetchRequest.plugin_name,
            plugin_type: this.browseService.currentFetchRequest.plugin_type,
            uri: this.browseService.currentFetchRequest.uri,
            service: this.browseService.currentFetchRequest.service
          };
        }
        this.$log.debug('search', emitPayload);
        this.socketService.emit('search', emitPayload);
      }, 600, false);
    } else {
      this.browseService.isSearching = false;
      this.browseService.lists = [];
    }
  }

  searchSubmit($event) {
    $event.preventDefault(); // Search has been done on input change, so don't submit
    this.$document[0].activeElement.blur(); // blur the input so that iOS keyboard closes
  }

  showHamburgerMenu(item) {
    let ret = item.type === 'radio-favourites' || item.type === 'radio-category' || item.type === 'spotify-category';
    return !ret;
  }

  showPlayButton(item) {
    if (!item) {
      return false;
    }
    // We avoid that by mistake one clicks on play all NAS or USB, freezing volumio
    if (item.type === 'folder' && item.uri && item.uri.startsWith('music-library/') && item.uri.split('/').length < 4 ) {
      return false;
    }
    let ret = item.type === 'folder' || item.type === 'song' ||
        item.type === 'mywebradio' || item.type === 'webradio' ||
        item.type === 'playlist' || item.type === 'cuesong' ||
        item.type === 'remdisk' || item.type === 'cuefile' ||
        item.type === 'folder-with-favourites' || item.type === 'internal-folder';
    return ret;
  }

  showAddToQueueButton(item) {
    let ret = item.type === 'folder' || item.type === 'song' ||
        item.type === 'mywebradio' || item.type === 'webradio' ||
        item.type === 'playlist' || item.type === 'remdisk' ||
        item.type === 'cuefile' || item.type === 'folder-with-favourites' ||
        item.type === 'internal-folder';
    return ret;
  }
  showAddToPlaylist(item) {
    let ret = item.type === 'folder' || item.type === 'song' ||
    item.type === 'remdisk' || item.type === 'folder-with-favourites' ||
    item.type === 'internal-folder';
    return ret;
  }

  showMoreStory(details) {
    if (this.checkAuthAndSubscription().authEnabled && this.checkAuthAndSubscription().plan !== 'superstar') {
      this.showPremiumFeatureModal();
      return;
    }
    if (details) {
      this.showCreditsDetails(details);
    }
  }

  showCreditsDetails(details) {
    const templateUrl = 'app/browse-music/components/modal/modal-credits-details.html';
    const controller = 'ModalCreditsDetailsController';
    const params = {
      title: details.title,
      story: details.story,
      credits: details.credits,
      upgradeCta: details.upgradeCta || false
    };
    this.modalService.openModal(
      controller,
      templateUrl,
      params,
      'md'
    );
  }

  checkAuthAndSubscription() {
    let result = {
      authEnabled: false,
      plan: null
    };
    if (this.authService) {
      result.authEnabled = this.authService.isEnabled;
      if (this.authService.user) {
        result.plan = this.authService.user.plan;
      }
    }
    return result;
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
    this.playlistService.addToFavourites(item);
  }

  addToFavoritesByIndex(e, listIndex, itemIndex) {
    e.stopPropagation();
    const item = this.browseService.lists[listIndex].items[itemIndex];
    this.addToFavorites(null, item);
  }

  fetchAdditionalMetas() {
    this.currentItemMetas = {};
    if (this.browseService.info) {
      if (this.browseService.info.type && this.browseService.info.type === 'artist' && this.browseService.info.title) {
        this.getArtistMetas(this.browseService.info);
      } else if (this.browseService.info.artist && this.browseService.info.album) {
        this.getAlbumMetas(this.browseService.info);
        this.getAlbumCredits(this.browseService.info);
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

  getAlbumMetas(albumInfo) {
    let requestObject = {
      'mode':'storyAlbum',
      'artist': albumInfo.artist,
      'album': albumInfo.album
    };
    return this.requestMetavolumioApi(requestObject);
  }

  /* ====== CREDITS IMPRO ====== */

  getArtistInfo(albumInfo) {

    if (this.checkAuthAndSubscription().authEnabled && this.checkAuthAndSubscription().plan !== 'superstar') {
      this.showPremiumFeatureModal();
      return;
    }

    if (albumInfo.artist) {
      /* We have the artist info for sure */
      let mataVolumioUrl =  this.socketService.host + '/api/v1/pluginEndpoint';
      let metaObject = {
        'endpoint': 'metavolumio',
        'data': {
          'mode':'storyArtist',
          'artist': albumInfo.artist
        }
      };
      if (this.currentItemMetas.artistStory) {
        /* We've already cached the result */
        this.showCreditsDetails({
          title: this.browseService.info.artist,
          story: this.currentItemMetas.artistStory
        });
      } else {
        /* First call, let's fetch the data */
        this.$http.post(mataVolumioUrl, metaObject, this.creditRequestOptions).then((response) => {
          if (response.data && response.data.success && response.data.data && response.data.data.value) {
            this.currentItemMetas.artistStory = response.data.data.value;
            this.showCreditsDetails({
              title: this.browseService.info.artist,
              story: this.currentItemMetas.artistStory
            });
          } else {
            this.showCreditsDetails({
              title: this.browseService.info.artist,
              story: `<h3>${ this.filteredTranslate('BROWSER.ARTIST_STORY_NOT_FOUND_FOR') } ${ this.browseService.info.artist }.</h3>`
            });
          }
        });
      }
    } else {
      /* We don't have artist info for any reason */
      return null;
    }
  }

  showPremiumFeatureModal() {
    this.showCreditsDetails({
      title: this.filteredTranslate('MYVOLUMIO.MODAL_DISCOVERY_PREMIUM_TITLE'),
      story: `
        <h2 class="text-center">${ this.filteredTranslate('MYVOLUMIO.MODAL_DISCOVERY_PREMIUM_HEADING') }</h2>
        <p class="text-center">${ this.filteredTranslate('MYVOLUMIO.MODAL_DISCOVERY_PREMIUM_TEXT') }</p>
      `,
      upgradeCta: true
    });
  }

  getAlbumCredits(albumInfo) {
    this.currentItemMetas.albumCredits = '';
    if (albumInfo && albumInfo.artist && albumInfo.album) {
      let mataVolumioUrl =  this.socketService.host + '/api/v1/pluginEndpoint';
      let metaObject = {
        'endpoint': 'metavolumio',
        'data': {
          'mode':'creditsAlbum',
          'artist': albumInfo.artist,
          'album': albumInfo.album
        }
      };
      return this.$http.post(mataVolumioUrl, metaObject, this.creditRequestOptions).then((response) => {
        if (response.data && response.data.success && response.data.data && response.data.data.value) {
          this.currentItemMetas.albumCredits = response.data.data.value;
        }
      });
    }
  }

  requestMetavolumioApi(data) {
    let mataVolumioUrl =  this.socketService.host + '/api/v1/pluginEndpoint';
    let metaObject = {
      'endpoint': 'metavolumio',
      'data': data
    };
    return this.$http.post(mataVolumioUrl, metaObject, this.creditRequestOptions).then((response) => {
      if (response.data && response.data.success && response.data.data && response.data.data.value) {
        this.currentItemMetas.story = response.data.data.value;
      }
    });
  }

  showCreditLink(uri, title) {
    let mataVolumioUrl =  this.socketService.host + '/api/v1/pluginEndpoint';
    let metaObject = {
      'endpoint': 'metavolumio',
      'data': {}
    };
    if (uri.indexOf('mbid:/artist/') > -1) {
      metaObject.data.mbid = uri.replace('mbid:/artist/', '');
      metaObject.data.mode = 'storyArtist';
      this.loadingCredit[uri] = true;
    } else if (uri.indexOf('mbid:/label/') > -1) {
      metaObject.data.mbid = uri.replace('mbid:/label/', '');
      metaObject.data.mode = 'storyLabel';
      this.loadingCredit[uri] = true;
    } else if (uri.indexOf('mbid:/place/') > -1) {
      metaObject.data.mbid = uri.replace('mbid:/place/', '');
      metaObject.data.mode = 'storyPlace';
      this.loadingCredit[uri] = true;
    } else {
      return;
    }

    return this.$http.post(mataVolumioUrl, metaObject, this.creditRequestOptions).then((response) => {
      if (response.data && response.data.success && response.data.data && response.data.data.value) {
        this.loadingCredit[uri] = false;
        return this.showCreditsDetails({'title': title, 'story': response.data.data.value});
      }
    });
  }

  playMusicCardClick(e, item) {
    e.stopPropagation();
    this.play(item);
  }

  playRenderedMusicCardClick(listIndex, itemIndex) {
    let item = this.browseService.lists[listIndex].items[itemIndex];
    if (item && item.type === 'song') {
      let list = this.browseService.lists[listIndex].items;
      this.playItemsList(item, list, itemIndex);
    } else {
      this.playItemsList(item);
    }
  }

  play(item) {
    if (this.browseService.currentFetchRequest.uri === 'playlists') {
      this.playQueueService.replaceAndPlay(item);
    } else {
      return this.playQueueService.playItemsList(item);
    }
  }

  addToQueue(item) {
    if (this.browseService.currentFetchRequest.uri === 'playlists') {
      this.playQueueService.enqueue(item);
    } else {
      this.playQueueService.add(item);
    }
  }

  replaceAndPlay(item) {
    if (item.type === 'cuesong') {
      this.playQueueService.replaceAndPlayCue(item);
    } else {
      this.playQueueService.replaceAndPlay(item);
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

  showAlbumCredits() {
    if (this.checkAuthAndSubscription().authEnabled && this.checkAuthAndSubscription().plan !== 'superstar') {
      this.showPremiumFeatureModal();
      return;
    }
    let creditsObject = {
      'title': this.browseService.info.album,
      'credits': this.currentItemMetas.albumCredits
    };
    this.showCreditsDetails(creditsObject);
  }

  playAlbumItemClick(item, list, itemIndex) {
    return this.playQueueService.playItemsList(item, list, itemIndex);
  }

  preventBubbling($event) {
    $event.stopPropagation();
    $event.preventDefault();
    /* $scope.status.isopen = !$scope.status.isopen; */
  }

  clickListItem(item, list, itemIndex) {
    if (item.type !== 'song' && item.type !== 'webradio' && item.type !== 'mywebradio' && item.type !== 'cuesong' && item.type !== 'album' && item.type !== 'artist' && item.type !== 'cd' && item.type !== 'play-playlist') {
      this.fetchLibrary(item);
    } else if (item.type === 'webradio' || item.type === 'mywebradio' || item.type === 'album' || item.type === 'artist') {
      this.play(item, list, itemIndex);
    } else if (item.type === 'song') {
      this.playItemsList(item, list, itemIndex);
    } else if (item.type === 'cuesong') {
      this.playQueueService.addPlayCue(item);
    } else if (item.type === 'cd') {
      this.playQueueService.replaceAndPlay(item);
    } else if ( item.type === 'play-playlist') {
      this.playQueueService.playPlaylist({title: item.name});
    }
  }

  clickListItemByIndex(listIndex, itemIndex) {
    let item = this.browseService.lists[listIndex].items[itemIndex];
    let list = this.browseService.lists[listIndex].items;
    this.clickListItem(item, list, itemIndex);
  }

  playItemsList(item, list, itemIndex) {
    return this.playQueueService.playItemsList(item, list, itemIndex);
  }

  addAndPlayList(item, list, itemIndex) {
    return this.playQueueService.addAndPlayList(item, list, itemIndex);
  }

  openMusicCardContenxtList(e, listIndex, itemIndex) {
    e.stopPropagation();
    let hamburgerMenuMarkup = `
      <div
          uib-dropdown
          on-toggle="browse.toggledItem(open, $event)"
          class="hamburgerMenu">
        <button id="hamburgerMenuBtn-${listIndex}-${itemIndex}" class="ghost-btn action-btn" uib-dropdown-toggle>
          <i class="fa fa-ellipsis-v"></i>
        </button>
        <ul class="dropdown-menu buttonsGroup align-to-right">
          <browse-hamburger-menu
              item="browse.browseService.lists[${listIndex}].items[${itemIndex}]"
              browse="browse">
          </browse-hamburger-menu>
        </ul>
      </div>
    `;
    hamburgerMenuMarkup = this.$compile(hamburgerMenuMarkup)(this.$scope);
    const hamburgerMenuBtn = document.getElementById(`hamburgerMenuBtn-${listIndex}-${itemIndex}`);
    if (hamburgerMenuBtn) {
      hamburgerMenuBtn.replaceWith(hamburgerMenuMarkup[0]);
    }

    this.$timeout(() => {
      document.querySelector(`#hamburgerMenuBtn-${listIndex}-${itemIndex}`).click();
    }, 0);
  }

  clickMusicCard(item) {
    if (item.type === 'song') {
      this.play(item);
    } else {
      this.fetchLibrary({ uri: item.uri });
    }
  }

  resetBrowsePage() {
    const page = document.getElementById('browse-page');
    page.innerHTML = '';
  }

  renderBrowsePage(lists) {
    const html = lists.map((list, listIndex) => this.renderList(list, listIndex));
    const page = document.getElementById('browse-page');
    page.style.display = 'none';
    page.innerHTML = html.join('');

    this.$timeout(() => {
      this.$rootScope.$broadcast('browseController:listRendered');
      page.style.display = 'block';
    }, 0, false);
  }

  renderList(list, listIndex) {
    const canShowGridView = this.browseService.canShowGridView(list);
    const showGridView = this.browseService.showGridView;
    let items = '';
    if(showGridView && canShowGridView) {
      items = this.renderMusicCardItems(list.items, listIndex);
    } else {
      items = this.renderListItems(list.items, listIndex);
    }

    const html = `
    <div
      class="main__source">
      <h3 class="main__source__title panel-title ${ !list.title ? 'hidden' : '' }">${ list.title || '' }</h3>
      <div class="${showGridView && canShowGridView ? 'main__row' : 'main__list'}">
        ${ items }
        ${ items.length === 0 ? '<h3 class="text-center panel-title ">No items</h3>' : '' }
      </div> <!-- /.main__row -->
    </div> <!-- /.main__source -->
    `;
    return html;
  }

  renderMusicCardItems(items, listIndex) {
    let angularThis = `angular.element('#browse-page').scope().browse`;
    const html = items.map((item, itemIndex) => `
    <div class="music-card__wrapper">
      <div class="music-card" onclick="${angularThis}.clickListItemByIndex(${listIndex}, ${itemIndex})">
        <div class="music-card__header">
            <img
                class="music-card__img ${ !item.albumart ? 'hidden' : '' }"
                src="${this.playerService.getAlbumart(item.albumart)}"
                alt="">
            <div
              class="music-card__img-icon ${ !item.icon ? 'hidden' : '' }">
              <i class="${ item.icon }"></i>
            </div>
            <div
                class="music-card__overlay">
                <div class="meta__genre">${ item.genre || '' }</div>
                <div
                    onclick="${angularThis}.preventBubbling(event)"
                    class="meta__actions ${
                        ( item.type === 'radio-favourites' || item.type === 'radio-category' || item.type === 'spotify-category' || item.type === 'title' || item.type === 'streaming-category' || item.type === 'item-no-menu') ? 'hidden' : ''
                    }">
                    <button
                        id="hamburgerMenuBtn-${listIndex}-${itemIndex}"
                        onclick="${angularThis}.openMusicCardContenxtList(event, ${listIndex}, ${itemIndex})"
                        class="ghost-btn action-btn">
                        <i class="fa fa-ellipsis-v"></i>
                    </button>
                </div>
                <div
                  class="meta__play ${ !this.showPlayButton(item) ? 'hidden' : '' }"
                  onclick="${angularThis}.preventBubbling(event)">
                    <button
                        onclick="${angularThis}.playRenderedMusicCardClick(${listIndex}, ${itemIndex})"
                        class="ghost-btn play-btn">
                        <i class="fa fa-play play-btn__icon"></i>
                    </button>
                </div>
                <div
                    onclick="${angularThis}.addToFavoritesByIndex(event, ${listIndex}, ${itemIndex})"
                    class="meta__favorite ${
                      this.showPlayButton(item) && (item.type === 'song' || item.type === 'folder-with-favourites') && this.browseService.currentFetchRequest.uri !== 'favourites' && !item.favourite ? '' : 'hidden'
                    } ${
                      item.favorite ? 'favorited' : ''
                    }">
                    <span class="meta__favorite-heart">
                        <i class="fa fa-heart"></i>
                    </span>
                </div>
            </div>
        </div>
        <div class="music-card__info">
            <div
                class="music-card__label ${ item.qualityDescription === 'HI_RES' ? 'mr-2' : '' }"
                title="${ item.title || '' }">
                    ${ item.title || '' }
            </div>

            <img class="music-card__extension ${ !item.tagImage ? 'hidden' : '' }" src="${ this.playerService.getAlbumart(item.tagImage) }">
        </div>
        <p class="music-card__meta">${ item.meta || (item.artist || '') }</p>
      </div>
    </div>
    `);
    let joinItems = html.join('');
    /* Add placeholder items for correct sizing */
    joinItems += `
      <div class="music-card__wrapper placeholder-wrapper"></div>
      <div class="music-card__wrapper placeholder-wrapper"></div>
      <div class="music-card__wrapper placeholder-wrapper"></div>
      <div class="music-card__wrapper placeholder-wrapper"></div>
      <div class="music-card__wrapper placeholder-wrapper"></div>
      <div class="music-card__wrapper placeholder-wrapper"></div>
    `;
    return joinItems;
  }

  renderListItems(items, listIndex) {
    let angularThis = `angular.element('#browse-page').scope().browse`;
    const html = items.map((item, itemIndex) => `
      <div class="album__tracks">
        <div class="music-item ${ item.type === 'title' ? 'title' : '' }" onclick="${angularThis}.clickListItemByIndex(${listIndex}, ${itemIndex})">
          <div
            onclick="${angularThis}.preventBubbling(event)"
            class="item__play ${ !this.showPlayButton(item) ? 'hidden' : '' }">
              <button
                  onclick="${angularThis}.playRenderedMusicCardClick(${listIndex}, ${itemIndex})"
                  class="ghost-btn play-btn">
                  <i class="fa fa-play play-btn__icon"></i>
              </button>
          </div>

          <div class="item__image">
              <div class="item__number ${ item.tracknumber && !item.albumart ? '' : 'hidden' }">${ item.tracknumber }.</div>
              <div class="item__albumart ${ !item.albumart ? 'hidden' : '' }">
                  <img class="item__image__img" src="${this.playerService.getAlbumart(item.albumart)}" alt="">
              </div>
              <div
                class="item__albumart-icon ${ !item.icon ? 'hidden' : '' }">
                <i class="${ item.icon }"></i>
              </div>
          </div>

          <div class="item__info">
              <div class="item__title truncate-text" title="${ item.title || '' }">
                  ${ item.title || '' } <img class="music-card__extension tagrow${ !item.tagImage ? 'hidden' : '' }" src="${ this.playerService.getAlbumart(item.tagImage) }">
              </div>
              <div class="item__album truncate-text ${ !item.album ? 'hidden' : '' }" title="${ item.album || '' }">
                  ${ item.album || '' }
              </div>
              <div class="item__info__separator ${ !item.album || !item.artist ? 'hidden' : '' }">
                  •
              </div>
              <div class="item__artist truncate-text ${ !item.artist ? 'hidden' : '' }" title="${ item.artist || '' }">
                  ${ item.artist || '' }
              </div>
          </div>

          <div
              onclick="${angularThis}.addToFavoritesByIndex(event, ${listIndex}, ${itemIndex})"
              class="item__favorite ${
                this.showPlayButton(item) && (item.type === 'song' || item.type === 'folder-with-favourites') && this.browseService.currentFetchRequest.uri !== 'favourites' && !item.favourite ? '' : 'hidden'
              } ${
                item.favorite ? 'favorited' : ''
              }">
              <span class="item__favorite-heart">
                  <i class="fa fa-heart"></i>
              </span>
          </div>

          <div
              class="item__duration ${ !item.duration ? 'hidden' : '' }">
                  ${ this.timeFormat(item.duration) }
          </div>

          <div
              onclick="${angularThis}.preventBubbling(event)"
              class="item__actions ${
                  ( item.type === 'radio-favourites' || item.type === 'radio-category' || item.type === 'spotify-category' || item.type === 'title' || item.type === 'streaming-category' || item.type === 'item-no-menu') ? 'hidden' : ''
              }">
              <button
                  id="hamburgerMenuBtn-${listIndex}-${itemIndex}"
                  onclick="${angularThis}.openMusicCardContenxtList(event, ${listIndex}, ${itemIndex})"
                  class="ghost-btn action-btn">
                  <i class="fa fa-ellipsis-v"></i>
              </button>
          </div>
      </div>
    </div>
    `);
    return html.join('');
  }

  toggleGridView() {
    this.browseService.toggleGridView();
    this.renderBrowsePage(this.browseService.lists);
  }

  isVolumio3Theme(){
    return this.themeManager.theme === 'volumio3';
  }

  fetchTrackTypeImage() {
    if (this.browseService.info && this.browseService.info.trackType) {
      this.browseService.info.fileFormat = '';
      this.browseService.info.fileFormat = this.loadFileFormatIcon(this.browseService.info.trackType);
    }
  }

  loadFileFormatIcon(trackType){
    return this.playerService.loadFileFormatIcon(trackType);
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
