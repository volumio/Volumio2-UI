class BrowseService {
  constructor($rootScope, $timeout, $log, socketService, mockService, $interval, $window) {
    'ngInject';
    this.$log = $log;
    this.socketService = socketService;
    this.$interval = $interval;
    this.$window = $window;
    this.isBrowsing = false;
    this.$rootScope = $rootScope;
    this.$log = $log;
    this.$timeout = $timeout;

    this.isPhone = false;
    this.filterBy = 'any';
    this.isBrowsing = false;
    this.isSearching = false;
    //this._filters = mockService.get('getBrowseFilters');
    // this._sources = mockService.get('getBrowseSources');
    // this.$log.debug(this._sources);
    // this.list = mockService.get('getBrowseList').list;
    this.limiter = 10;
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
    let obj = {uri: item.uri};
    this.$log.debug('fetchLibrary', item);
    this.currentFetchRequest = item;
    this.socketService.emit('browseLibrary', obj);
    this.isBrowsing = true;
    if (!back) {
      this.scrollPositions.delete(item.uri);
    }
  }

  backHome() {
    this.isBrowsing = false;
    this.isSearching = false;
    this.list = [];
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

  toggleGridView() {
    this.showGridView = !this._showGridView;
  }

  get showGridView() {
    //Return value based on preferences and view availability
    if (this.availableListViews.length === 1) {
      return this.availableListViews[0] === 'grid';
    }
    if (this._showGridView && ~this.availableListViews.indexOf('grid')) {
      return true;
    } else {
      return false;
    }
  }

  set showGridView(showGridView) {
    //Store user preference
    this._showGridView = showGridView;
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
      this.$log.debug('pushBrowseSources', data);
      this.availableListViews = ['list'];
      this.sources = data;
    });
    this.socketService.on('pushBrowseLibrary', (data) => {
      if (data.navigation) {
        this.list = data.navigation.list;
        //TODO get this data from backend
        this.availableListViews = ['list', 'grid'];//this.availableListViews;
        console.error(this.availableListViews);
        this.listLength = this.list.length;
        this.$log.debug('pushBrowseLibrary', this.listLength, this.list);

        this.breadcrumbs = data.navigation.prev;
        this.$rootScope.$broadcast('browseService:fetchEnd');
      }
    });
  }

  initService() {
    this.socketService.emit('getBrowseFilters');
    this.socketService.emit('getBrowseSources');
    this._isBrowsing = false;
    this._listBy = 'track';
    //TODO or from sessionStorage
    this._showGridView = false;
    //this.socketService.emit('browseLibrary', {});
  }

}

export default BrowseService;
