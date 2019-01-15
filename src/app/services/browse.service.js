class BrowseService {
  constructor($rootScope, $timeout, $log, socketService, mockService, $interval, $window, localStorageService) {
    'ngInject';
    this.$log = $log;
    this.socketService = socketService;
    this.$interval = $interval;
    this.$window = $window;
    this.isBrowsing = false;
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

  sendEject(data) {
    this.socketService.emit('callMethod', data);
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
        this.info = data.navigation.info;

        this.breadcrumbs = data.navigation.prev;
        this.eject = data.navigation.eject;
        this.rip = data.navigation.rip;

        this.$rootScope.$broadcast('browseService:fetchEnd');
      }
    });
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
