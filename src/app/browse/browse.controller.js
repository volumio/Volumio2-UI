class BrowseController {
  constructor($scope, browseService, playQueueService, playlistService, socketService,
      modalService, $timeout, matchmediaService, $compile, $document, $rootScope, $log) {
    'ngInject';
    this.$log = $log;
    this.browseService = browseService;
    this.playQueueService = playQueueService;
    this.playlistService = playlistService;
    this.socketService = socketService;
    this.modalService = modalService;
    this.$timeout = $timeout;
    this.matchmediaService = matchmediaService;
    this.$compile = $compile;
    this.$document = $document;
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    this.renderBrowseTable();
    $scope.$on('browseService:fetchEnd', () => {
      this.renderBrowseTable();
    });
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

  clickListItem(item) {
    if (item.type !== 'song' && item.type !== 'webradio' && item.type !== 'mywebradio' && item.type !== 'cuesong') {
      this.fetchLibrary(item);
    }
  }
  clickListItemByIndex(index) {
    let item = this.browseService.list[index];
    this.clickListItem(item);
  }

  dblClickListItem(item) {
    if (item.type === 'song' || item.type === 'webradio' || item.type === 'mywebradio') {
      this.play(item);
    } else if (item.type === 'cuesong') {
      this.playQueueService.addPlayCue(item);
    }
  }
  dblClickListItemByIndex(index) {
    let item = this.browseService.list[index];
    this.dblClickListItem(item);
  }

  hamburgerMenuClick(button, index) {
    let hamburgerMenuMarkup = `
      <div
          uib-dropdown
          on-toggle="browse.toggledItem(open, $event)"
          class="hamburgerMenu">
        <button id="hamburgerMenuBtn-${index}" class="dropdownToggle btn-link" uib-dropdown-toggle>
          <i class="fa fa-bars"></i>
        </button>
        <ul class="dropdown-menu buttonsGroup"
          ng-class="::{'last': (${index} > 2 && this.browseService.listLength - ${index} < 3)}">
          <browse-hamburger-menu item="browse.browseService.list[${index}]" browse="browse"></browse-hamburger-menu>
        </ul>
      </div>
    `;
    hamburgerMenuMarkup = this.$compile(hamburgerMenuMarkup)(this.$scope);
    let buttonParent = angular.element(button).parent();
    buttonParent.replaceWith(hamburgerMenuMarkup);
    this.$timeout(() => {
      document.querySelector(`#hamburgerMenuBtn-${index}`).click();
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
      if (this.searchTimeoutHandler) {
        this.$timeout.cancel(this.searchTimeoutHandler);
      }
      this.searchTimeoutHandler = this.$timeout(() => {
        this.$log.debug('search', this.searchField);
        this.socketService.emit('search', {value: this.searchField});
      }, 300, false);
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
    if (!this.browseService.list || this.browseService.list.length === 0) {
      return false;
    }
    this.table = '';
    let angularThis = `angular.element('#browseTableItems').scope().browse`;
    for (var i = 0, ll = this.browseService.list.length ; i < ll; i++) {
      let item = this.browseService.list[i];
      this.table += `<tr>`;

      if (item.type === 'title') {
        this.table += `
          <td class="rowTitle" colspan="3">
            <i class="${item.icon} ${(item.icon) ? '' : 'hidden'}"></i> ${item.title}
          </td>`;
      }

      if (item.type !== 'title') {
        this.table += `<td class="image">`;

        if (!item.icon) {
          this.table += `
          <img
              ${(!item.icon) ? 'src="' + this.socketService.host + item.albumart + '"' : ''}
              alt="${item.title}"/>`;
        }

        if (item.icon) {
          this.table += `<i class="${item.icon}"></i>`;
        }

        this.table += `</td>`;
      }

      if (item.type !== 'title') {
        this.table += `
        <td class="breakMe"
            onclick="${angularThis}.clickListItemByIndex(${i})"
            ondblclick="${angularThis}.dblClickListItemByIndex(${i})">
          <div class="title">
            ${item.title}
          </div>
          <div class="artist-album
              ${(item.artist || item.album) ? '' : 'hidden'}">
            ${item.artist} - ${item.album}
          </div>
        </td>
        <td class="commandButtons">
          <div class="hamburgerMenu
              ${(item.type === 'radio-favourites' || item.type === 'radio-category' || item.type === 'title') ?
                  'hidden' : ''}">
            <button class="dropdownToggle btn-link" onclick="${angularThis}.hamburgerMenuClick(this, ${i})"
                title="Options...">
              <i class="fa fa-bars"></i>
            </button>
          </div>
        </td>`;
      }
      this.table += `</tr>`;
    }
    let tbody = document.createElement('tbody');
    window.requestAnimationFrame(() => {
      angular.element(tbody).append(this.table);
      angular.element('#browseTableItems tbody').replaceWith(tbody); //.appendChild(this.table);
      this.$rootScope.$broadcast('browseController:listRendered');
    });
  }
}

export default BrowseController;
