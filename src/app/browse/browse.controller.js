class BrowseController {
  constructor($scope, browseService, playQueueService, playlistService, socketService,
      modalService, $timeout, matchmediaService, $compile, $document, $rootScope, $log, playerService) {
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

    if (this.browseService.isBrowsing || this.browseService.isSearching) {
      this.renderBrowseTable();
    }
    $scope.$on('browseService:fetchEnd', () => {
      this.renderBrowseTable();
    });

    this.initController();
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

  replaceAndPlay(item) {
    if (item.type === 'cuesong') {
      this.playQueueService.replaceAndPlayCue(item);
    } else {
      this.playQueueService.replaceAndPlay(item);
    }
  }

  clickListItem(item) {
    if (item.type !== 'song' && item.type !== 'webradio' && item.type !== 'mywebradio' && item.type !== 'cuesong') {
      this.fetchLibrary(item);
    } else if (item.type === 'song' || item.type === 'webradio' || item.type === 'mywebradio') {
      this.play(item);
    } else if (item.type === 'cuesong') {
      this.playQueueService.addPlayCue(item);
    }
  }
  clickListItemByIndex(listIndex, itemIndex) {
    let item = this.browseService.lists[listIndex].items[itemIndex];
    this.clickListItem(item);
  }

  //TODO remove this code
  // dblClickListItem(item) {
  //   if (item.type === 'song' || item.type === 'webradio' || item.type === 'mywebradio') {
  //     this.play(item);
  //   } else if (item.type === 'cuesong') {
  //     this.playQueueService.addPlayCue(item);
  //   }
  // }
  // dblClickListItemByIndex(listIndex, itemIndex) {
  //   let item = this.browseService.lists[listIndex].items[itemIndex];
  //   this.dblClickListItem(item);
  // }

  hamburgerMenuClick(button, listIndex, itemIndex) {
    let hamburgerMenuMarkup = `
      <div
          uib-dropdown
          on-toggle="browse.toggledItem(open, $event)"
          class="hamburgerMenu">
        <button id="hamburgerMenuBtn-${listIndex}-${itemIndex}" class="dropdownToggle btn-link" uib-dropdown-toggle>
          <i class="fa fa-ellipsis-v"></i>
        </button>
        <ul class="dropdown-menu buttonsGroup">
          <browse-hamburger-menu
              item="browse.browseService.lists[${listIndex}].items[${itemIndex}]"
              browse="browse">
          </browse-hamburger-menu>
        </ul>
      </div>
    `;
    hamburgerMenuMarkup = this.$compile(hamburgerMenuMarkup)(this.$scope);
    let buttonParent = angular.element(button).parent();
    buttonParent.replaceWith(hamburgerMenuMarkup);
    this.$timeout(() => {
      document.querySelector(`#hamburgerMenuBtn-${listIndex}-${itemIndex}`).click();
    }, 0);
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
      this.browseService.isSearching = true;
      if (this.searchTimeoutHandler) {
        this.$timeout.cancel(this.searchTimeoutHandler);
      }
      this.searchTimeoutHandler = this.$timeout(() => {
        let emitPayload = {
          type: this.browseService.filterBy,
          value: this.searchField
        };
        this.$log.debug('search', emitPayload);
        this.socketService.emit('search', emitPayload);
      }, 600, false);
    } else {
      this.browseService.isSearching = false;
      this.browseService.lists = [];
    }
  }

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
    this.$log.debug('browseServiceHamburgerClick', item);
    this.socketService.emit(item.emit, item.payload);
  }

  renderBrowseTable() {
    if (!this.browseService.lists) {
      return false;
    }

    this.$timeout(() => {
      let angularThis = `angular.element('#browseTablesWrapper').scope().browse`;

      this.table = '';
      this.browseService.lists.forEach((list, listIndex) => {
        //Print title
        if (list.title) {
          this.table += `
            <div class="rowTitle">
              <i class="${list.icon} ${(list.icon) ? '' : 'hidden'}"></i> ${list.title}
            </div>`;
        }

        this.table += `<div class="listWrapper">`;
        list.items.forEach((item, itemIndex) => {
          //Print items
          this.table += `<div class="itemWrapper"><div class="itemTab">`;

          this.table += `<div class="image"
              onclick="${angularThis}.clickListItemByIndex(${listIndex}, ${itemIndex})">`;
          if (!item.icon && item.albumart) {
            this.table += `
            <img src="${this.playerService.getAlbumart(item.albumart)}" alt="${item.title}"/>`;
          }

          if (item.icon) {
            // this.table += `<img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/PearlJam1.jpg/220px-PearlJam1.jpg"/>`;
            this.table += `<i class="${item.icon}"></i>`;
          }
          this.table += `</div>`;

          this.table += `
            <div class="commandButtons">
              <div class="hamburgerMenu
                  ${(item.type === 'radio-favourites' || item.type === 'radio-category' || item.type === 'title' ||
                      item.category === 'streaming-category') ?
                      'hidden' : ''}">
                <button class="dropdownToggle btn-link"
                    onclick="${angularThis}.hamburgerMenuClick(this, ${listIndex}, ${itemIndex}, event)"
                    title="Options...">
                  <i class="fa fa-ellipsis-v"></i>
                </button>
              </div>
            </div>`;

          this.table += `
            <div class="description breakMe"
                onclick="${angularThis}.clickListItemByIndex(${listIndex}, ${itemIndex})">
              <div class="title ${(item.artist || item.album) ? '' : 'onlyTitle'}">
                ${(item.title) ? item.title : ''}
              </div>
              <div class="artist-album ${(item.artist || item.album) ? '' : 'onlyTitle'}">
                ${(item.artist) ? item.artist : ''} ${(item.album) ? '- ' + item.album : ''}
              </div>
            </div>`;

          this.table += `</div></div>`;
        });
        this.table += `</div>`;
      });

      this.table += `<div class="clearfix"></div>`;

      this.$timeout(() => {
        let browseTable = document.querySelector('.browseTable');
        browseTable.style.display = 'none';
        browseTable.innerHTML = this.table;
        browseTable.style.display = 'block';
        this.applyGridStyle();
        this.$rootScope.$broadcast('browseController:listRendered');
      }, 50, false);
    }, 0);
  }

  applyGridStyle() {
    const itemWrappers = document.querySelectorAll('.listWrapper');
    this.browseService.lists.forEach((list, i) => {
      if (this.browseService.canShowGridView(list)) {
        itemWrappers[i].classList.add('grid');
      } else {
        itemWrappers[i].classList.remove('grid');
      }
    });
  }

  toggleGridView() {
    this.browseService.toggleGridView();
    this.applyGridStyle();
  }

  initController() {
    let bindedBackListener = this.backListener.bind(this);
    this.$document[0].addEventListener('keydown', bindedBackListener, false);
    this.$scope.$on('$destroy', () => {
      this.$document[0].removeEventListener('keydown', bindedBackListener, false);
    });
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
}

export default BrowseController;
