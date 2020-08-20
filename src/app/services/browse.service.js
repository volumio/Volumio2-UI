class BrowseService {
  constructor($rootScope, $timeout, $log, socketService, mockService, $interval, $window, localStorageService) {
    'ngInject';
    this.$log = $log;
    this.socketService = socketService;
    this.$interval = $interval;
    this.$window = $window;
    this.$rootScope = $rootScope;
    this.$log = $log;
    this.$timeout = $timeout;
    this.mockService = mockService;

    this.isPhone = false;
    this.filterBy = 'any';
    this.isBrowsing = false;
    this.isSearching = false;
    this.localStorageService = localStorageService;
    //this._filters = mockService.get('getBrowseFilters');
    // this._sources = mockService.get('getBrowseSources');
    // this.$log.debug(this._sources);
    // this.list = mockService.get('getBrowseList').list;
    this.limiter = 10;
    this.currentFetchRequest = {};
    this.historyUri = [];
    this.scrollPositions = new Map();
    this.lastBrowseLists = [];

    this.navigationStack = [];

    this.init();
    $rootScope.$on('socket:init', () => {
      this.init();
    });
    $rootScope.$on('socket:reconnect', () => {
      this.initService();
    });
  }

  fetchLibrary(item, back) {

    if (item.uri === '/') {
      this.backHome();
      return false;
    }

    let obj = {uri: item.uri};
    if (!back) {
      if  (this.historyUri.length) {
        obj.prevUri = this.historyUri[this.historyUri.length - 1].uri;
      }
      this.historyUri.push(item);
    } else {
      this.historyUri.pop();
    }
    this.$log.debug('fetchLibrary', obj);
    this.currentFetchRequest = item;
    this.socketService.emit('browseLibrary', obj);
    if (!item.static) {
      this.isBrowsing = true;
    }
    if (!back) {
      this.scrollPositions.delete(item.uri);
    }
  }

  /*
    ====== Back functionality for the new navigation stack ======
  */

  goBack() {
    const depth = this.navigationStack.length;


    if (depth > 1) {
        this.lists = this.navigationStack[depth - 2].lists;
        this.lastBrowseLists = this.navigationStack[depth - 2].lists;
        this.info = this.navigationStack[depth - 2].info;

        this.breadcrumbs = this.navigationStack[depth - 2].prev;
        this.eject = this.navigationStack[depth - 2].eject;
        this.rip = this.navigationStack[depth - 2].rip;

        this.navigationStack.pop();

        this.$rootScope.$broadcast('browseService:fetchEnd');
        this.currentFetchRequest = this.navigationStack[depth - 2];

       /*  window.location.hash = this.navigationStack[depth - 2].uri; */

    } else {
      this.navigationStack = [];
      this.backHome();
      /* window.location.hash = '';
      this.removeLocationHash(); */
    }
  }

  removeLocationHash(){
      var noHashURL = window.location.href.replace(/#.*$/, '');
      window.history.replaceState('', document.title, noHashURL);
  }

  sendEject(data) {
    this.socketService.emit('callMethod', data);
    this.$rootScope.$broadcast('browseService:eject');
    this.backHome();
  }

  sendRip(data) {
    this.socketService.emit('callMethod', data);
  }

  backHome() {
    this.isBrowsing = false;
    this.isSearching = false;
    this.lists = [];
    this.historyUri = [];
    this.currentFetchRequest = {};
    this.scrollPositions.clear();
  }

  goTo(emitPayload) {
    this.backHome();
    this.isSearching = true;
    this.isBrowsing = false;
    this.$log.debug('goTo', emitPayload);
    this.$timeout(() => {
      this.socketService.emit('goTo', emitPayload);
      // this.socketService.emit('search', emitPayload);
    }, 0);
  }

  filterBy(filter) {
    if (this.filterBy === filter) {
      filter = 'all';
    }
    this.filterBy = filter;
  }

  get filters() {
    return this._filters;
  }

  set filters(filters) {
    this._filters = filters;
  }

  get sources() {
    return this._sources;
  }

  set sources(sources) {
    this._sources = sources;
  }

  get list() {
    return this._list;
  }

  set list(list) {
    this._list = list;
  }

  get isBrowsing() {
    return this._isBrowsing;
  }

  set isBrowsing(val) {
    this._isBrowsing = val;
  }

  get breadcrumbs() {
    return this._breadcrumbs;
  }

  set breadcrumbs(breadcrumbs) {
    this._breadcrumbs = breadcrumbs;
  }

  canShowGridView(list) {
    //Return value based on preferences and view availability
    if (list.availableListViews.length === 1) {
      return list.availableListViews[0] === 'grid';
    }
    if (this.showGridView && ~list.availableListViews.indexOf('grid')) {
      return true;
    } else {
      return false;
    }
  }

  get showGridView() {
    return this._showGridView;
  }

  set showGridView(showGridView) {
    //Store user preference
    this.localStorageService.set('showGridView', showGridView);
    this._showGridView = showGridView;
  }

  get showGridViewSelector() {
    if (!this.lists || this.lists.length === 0) {
      return false;
    }
    for (let i = 0; i < this.lists.length; i++) {
      if (this.lists[i].availableListViews.length > 1) {
        return true;
      }
    }
    return false;
  }

  toggleGridView() {
    this.showGridView = !this.showGridView;
  }

  init() {
    this.registerListner();
    this.initService();
  }

  registerListner() {
    this.socketService.on('pushBrowseFilters', (data) => {
      this.$log.debug('pushBrowseFilters', data);
      this.filters = data;
    });
    this.socketService.on('pushBrowseSources', (data) => {
      this.availableListViews = ['list'];
      for (let i = 0; i < data.length; i++) {
        if (data[i].albumart) {
          data[i].albumart = this.getSourcesAlbumart(data[i].albumart);
        }
      }
      this.sources = data;
      this.$log.debug('pushBrowseSources', data);
    });
    this.socketService.on('pushBrowseLibrary', (data) => {
      // data = this.mockService.get('getBrowseLibrary');
      if (data.navigation) {
        this.$log.debug('pushBrowseLibrary', data);
        this.lists = data.navigation.lists;
        this.lastBrowseLists = data.navigation.lists;
        this.info = data.navigation.info;

        this.breadcrumbs = data.navigation.prev;
        this.eject = data.navigation.eject;
        this.rip = data.navigation.rip;

        /*
          ====== New navigation stack ======
        */

        /*

        Wee need to find a better way for hash navigation

        window.onhashchange = evt => {
          const decodedURIHash = decodeURIComponent(window.location.hash);
          const cleaneDecodedURIHash = decodedURIHash.replace(/^#/, '');
          const navigationStackItem = this.findHashInNavigationStack(cleaneDecodedURIHash);
          if (navigationStackItem) {
            this.goBack();
            return;
          }
        };

        window.location.hash = this.currentFetchRequest.uri;

        */

        this.navigationStack.push({
          album: this.currentFetchRequest.album || null,
          albumart: this.currentFetchRequest.albumart || null,
          artist: this.currentFetchRequest.artist || null,
          service: this.currentFetchRequest.service || null,
          title: this.currentFetchRequest.title || null,
          type: this.currentFetchRequest.type || null,
          uri: this.currentFetchRequest.uri || null,
          plugin_name: this.currentFetchRequest.plugin_name || null,
          plugin_type: this.currentFetchRequest.plugin_type || null,
          icon: this.currentFetchRequest.icon || null,
          lists: data.navigation.lists || null,
          info: data.navigation.info || null,
          breadcrumbs: data.navigation.prev || null,
          eject: data.navigation.eject || null,
          rip: data.navigation.rip || null,
        });

        this.$log.debug('navigationStack', this.navigationStack);
        /*
          ====== New navigation stack ======
        */

        this.$rootScope.$broadcast('browseService:fetchEnd');
      }
    });
    this.socketService.on('pushActiveDumbInput', (data) => {
      for (var i in this.lists[0].items) {
        if (this.lists[0].items[i].title === data) {
          this.lists[0].items[i].active = true;
        } else {
          this.lists[0].items[i].active = false;
        }
      }
      this.$rootScope.$broadcast('browseService:fetchEnd');
    });
  }

  findHashInNavigationStack(uri) {
    return this.navigationStack.find(item => item.uri === uri);
  }

  getSourcesAlbumart(albumart) {
    if (!albumart) {
      return '';
    }
    if (~albumart.indexOf('http')) {
      return albumart;
    } else {
      return `${this.socketService.host}${albumart}`;
    }
  }

  initService() {
    this.socketService.emit('getBrowseFilters');
    this.socketService.emit('getBrowseSources');
    this._listBy = 'track';
    //TODO or from sessionStorage
    // this._showGridView = false;
    this._showGridView = this.localStorageService.get('showGridView');

    //this.socketService.emit('browseLibrary', {});
  }

}

export default BrowseService;
