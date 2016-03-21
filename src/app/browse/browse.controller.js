class BrowseController {
  constructor($scope, browseService, playQueueService, playlistService, socketService,
      modalService, $timeout, matchmediaService, $sce, $compile) {
    'ngInject';
    this.browseService = browseService;
    this.playQueueService = playQueueService;
    this.playlistService = playlistService;
    this.socketService = socketService;
    this.modalService = modalService;
    this.$timeout = $timeout;
    this.matchmediaService = matchmediaService;
    this.$compile = $compile;
    this.$scope = $scope;



    $scope.$on('browseService:fetchEnd', () => {
      // console.log('end', this.browseService.list);
      this.startPerf = performance.now();
      this.table = '';
      for (var i = 0, ll = this.browseService.list.length ; i < ll; i++) {
        this.table += `
        <tr>
          <td class="image">
            <i class="${this.browseService.list[i].icon}"></i>
          </td>
          <td
              ng-click="browse.clickListItem(browse.browseService.list[${i}], $event)"
              ng-dblclick="browse.dblClickListItem(browse.browseService.list[${i}], $event)"
              class="breakMe">
            <div class="title">
              ${this.browseService.list[i].title}
            </div>
            <div class="artist-album">
              ${this.browseService.list[i].artist} - ${this.browseService.list[i].album}
            </div>
          </td>
          <td class="commandButtons">
            <div
                class="hamburgerMenu">
              <button class="dropdownToggle btn-link" >
                <i class="fa fa-bars"></i>
              </button>
            </div>
          </td>
        </tr>
        `;
      }
      // console.log(this.table);
      // console.log(this.$scope);
      console.info('List created',  performance.now() - this.startPerf);
      this.table = this.$compile(this.table)(this.$scope);
      console.info('List compi',  performance.now() - this.startPerf);
      // console.dir(this.table);
      // console.log(angular.element('#testTable'));
      let tbody = document.createElement('tbody');
      window.requestAnimationFrame(() => {
        angular.element(tbody).append(this.table);
        angular.element('#browseTableItems tbody').replaceWith(tbody); //.appendChild(this.table);
        console.info('List rendered',  performance.now() - this.startPerf);
      });
    });
  }

  hamburgerMenuClick(item, ev) {
    console.log('hamburgerMenuClick', item);
  }

  fetchLibrary(item, back = false) {
    console.log(item);
    if (item.uri !== 'cd') {
      this.browseService.fetchLibrary(item, back);
    }
  }

  backHome() {
    this.searchField = '';
    this.browseService.backHome();
  }

  play(item) {
    if (this.browseService.currentFetchRequest && this.browseService.currentFetchRequest.uri === 'playlists') {
      this.playQueueService.playPlaylist(item);
    } else if (item.type === 'cuesong') {
      this.playQueueService.addPlayCue(item);
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
        item.type === 'playlist' || item.type === 'cuesong';
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

  //Browse services hamburger menu
  browseServiceHamburgerClick(item) {
    console.log('browseServiceHamburgerClick', item);
    this.socketService.emit(item.emit, item.payload);
  }
}

export default BrowseController;
